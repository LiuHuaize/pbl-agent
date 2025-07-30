from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from typing import List, Dict, Any
from datetime import datetime
import json
import uuid
from services.database import get_database
from services.gemini_client import get_gemini_client
from models.schemas import UserInteraction, AgentResponse, SuccessResponse
from api.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/process", response_model=AgentResponse, summary="处理用户交互")
async def process_interaction(
    interaction: UserInteraction,
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
    gemini_client=Depends(get_gemini_client)
):
    """处理用户交互并生成AI响应"""
    try:
        # 检查项目存在性和所有权
        project = await db.get_project(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="项目不存在"
            )
        
        if project["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无权操作此项目"
            )
        
        # 根据交互类型和阶段处理不同的逻辑
        response_data = await _process_stage_interaction(
            interaction, project, gemini_client, db
        )
        
        # 保存交互记录
        interaction_data = {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "stage": interaction.stage,
            "user_input": interaction.dict(),
            "ai_response": response_data,
            "timestamp": datetime.now().isoformat()
        }
        
        await db.save_interaction(interaction_data)
        
        return AgentResponse(**response_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"处理交互失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"处理交互失败: {str(e)}"
        )

@router.post("/stream", summary="流式处理用户交互")
async def stream_interaction(
    interaction: UserInteraction,
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
    gemini_client=Depends(get_gemini_client)
):
    """流式处理用户交互并生成AI响应"""
    try:
        # 检查项目存在性和所有权
        project = await db.get_project(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="项目不存在"
            )
        
        if project["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无权操作此项目"
            )
        
        # 流式响应生成器
        async def generate_stream_response():
            try:
                # 根据交互类型构建提示词
                prompt = await _build_interaction_prompt(interaction, project)
                
                accumulated_response = ""
                
                # 流式生成内容
                async for chunk in gemini_client.generate_stream(prompt):
                    accumulated_response += chunk
                    
                    # 流式数据格式
                    stream_data = {
                        "type": "stream",
                        "content": chunk,
                        "accumulated": accumulated_response,
                        "timestamp": datetime.now().isoformat()
                    }
                    
                    yield f"data: {json.dumps(stream_data, ensure_ascii=False)}\n\n"
                
                # 最终响应
                final_response = await _parse_stream_response(
                    accumulated_response, interaction, project
                )
                
                # 保存交互记录
                interaction_data = {
                    "id": str(uuid.uuid4()),
                    "project_id": project_id,
                    "stage": interaction.stage,
                    "user_input": interaction.dict(),
                    "ai_response": final_response,
                    "timestamp": datetime.now().isoformat()
                }
                
                await db.save_interaction(interaction_data)
                
                # 发送最终响应
                final_data = {
                    "type": "complete",
                    "response": final_response,
                    "timestamp": datetime.now().isoformat()
                }
                
                yield f"data: {json.dumps(final_data, ensure_ascii=False)}\n\n"
                
            except Exception as e:
                error_data = {
                    "type": "error",
                    "error": str(e),
                    "timestamp": datetime.now().isoformat()
                }
                yield f"data: {json.dumps(error_data, ensure_ascii=False)}\n\n"
        
        return StreamingResponse(
            generate_stream_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"流式处理交互失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"流式处理交互失败: {str(e)}"
        )

@router.get("/history/{project_id}", response_model=List[Dict[str, Any]], summary="获取交互历史")
async def get_interaction_history(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """获取项目的交互历史记录"""
    try:
        # 检查项目存在性和所有权
        project = await db.get_project(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="项目不存在"
            )
        
        if project["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无权访问此项目"
            )
        
        # 获取交互历史
        interactions = await db.get_project_interactions(project_id)
        return interactions
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取交互历史失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取交互历史失败: {str(e)}"
        )

# 私有辅助函数
async def _process_stage_interaction(
    interaction: UserInteraction, 
    project: Dict[str, Any], 
    gemini_client, 
    db
) -> Dict[str, Any]:
    """根据阶段处理不同的交互逻辑"""
    
    if interaction.stage == "requirements":
        # 需求调研阶段
        if interaction.action == "submit_requirements":
            theme_suggestions = await gemini_client.analyze_requirements(interaction.data)
            return {
                "status": "success",
                "stage": "requirements",
                "action": "select_theme",
                "data": theme_suggestions,
                "message": "基于您的需求，我为您推荐了以下项目主题"
            }
    
    elif interaction.stage == "theme_design":
        # 主题设计阶段
        if interaction.action == "select_theme":
            context = {
                "requirements": project.get("requirements_data", {}),
                "theme": interaction.data
            }
            theme_framework = await gemini_client.generate_theme_framework(interaction.data, context)
            return {
                "status": "success",
                "stage": "theme_design",
                "action": "confirm_framework",
                "data": theme_framework,
                "message": "项目核心框架已生成，请确认并进入下一阶段"
            }
    
    elif interaction.stage == "teaching_design":
        # 教学设计阶段
        if interaction.action == "design_activities":
            # 获取可用的活动卡
            available_cards = await db.get_activity_cards()
            context = {
                "requirements": project.get("requirements_data", {}),
                "theme": project.get("theme_design_data", {})
            }
            
            recommended_activities = await gemini_client.recommend_activities(
                interaction.stage, context, available_cards
            )
            
            return {
                "status": "success",
                "stage": "teaching_design",
                "action": "select_activities",
                "data": recommended_activities,
                "message": "基于您的项目信息，推荐以下教学活动"
            }
    
    elif interaction.stage == "resource_matching":
        # 资源匹配阶段
        if interaction.action == "generate_final_solution":
            project_data = {
                "requirements": project.get("requirements_data", {}),
                "theme_design": project.get("theme_design_data", {}),
                "teaching_design": project.get("teaching_design_data", {}),
                "resource_data": project.get("resource_data", {})
            }
            
            final_solution = await gemini_client.generate_final_solution(project_data)
            
            return {
                "status": "success",
                "stage": "resource_matching",
                "action": "solution_complete",
                "data": final_solution,
                "message": "完整的PBL教学方案已生成！"
            }
    
    # 默认响应
    return {
        "status": "error",
        "stage": interaction.stage,
        "action": "unknown",
        "data": {},
        "message": f"未知的交互类型: {interaction.action}"
    }

async def _build_interaction_prompt(
    interaction: UserInteraction, 
    project: Dict[str, Any]
) -> str:
    """构建交互提示词"""
    
    base_prompt = f"""
    作为一个专业PBL教学设计专家，请处理以下用户交互。
    
    项目信息：
    - 项目标题：{project.get('title', '')}
    - 项目描述：{project.get('description', '')}
    - 当前阶段：{interaction.stage}
    
    用户交互：
    - 动作：{interaction.action}
    - 数据：{json.dumps(interaction.data, ensure_ascii=False)}
    
    请根据交互内容生成相应的响应。
    """
    
    return base_prompt

async def _parse_stream_response(
    response_text: str, 
    interaction: UserInteraction, 
    project: Dict[str, Any]
) -> Dict[str, Any]:
    """解析流式响应的最终结果"""
    
    try:
        # 尝试解析为JSON
        parsed_response = json.loads(response_text)
        return parsed_response
    except json.JSONDecodeError:
        # 如果不是JSON格式，返回原始文本
        return {
            "status": "success",
            "stage": interaction.stage,
            "action": "continue",
            "data": {"response": response_text},
            "message": "内容已生成"
        }