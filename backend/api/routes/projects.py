from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime
from services.database import get_database
from services.gemini_client import get_gemini_client
from models.schemas import (
    ProjectCreate, ProjectUpdate, ProjectResponse, 
    RequirementsFormData, ThemeSelection, UserInteraction, 
    AgentResponse, SuccessResponse, ErrorResponse
)
from api.dependencies import get_current_user
import uuid
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=ProjectResponse, summary="创建项目")
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """创建新的PBL项目"""
    try:
        project_data = {
            "id": str(uuid.uuid4()),
            "user_id": current_user["id"],
            "title": project.title,
            "description": project.description,
            "status": "draft",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        result = await db.create_project(project_data)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="创建项目失败"
            )
        
        return ProjectResponse(**result)
        
    except Exception as e:
        logger.error(f"创建项目失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建项目失败: {str(e)}"
        )

@router.get("/", response_model=List[ProjectResponse], summary="获取用户项目列表")
async def get_user_projects(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """获取当前用户的所有项目"""
    try:
        projects = await db.get_user_projects(current_user["id"])
        return [ProjectResponse(**project) for project in projects]
        
    except Exception as e:
        logger.error(f"获取用户项目失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取项目列表失败: {str(e)}"
        )

@router.get("/{project_id}", response_model=ProjectResponse, summary="获取项目详情")
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """获取指定项目的详细信息"""
    try:
        project = await db.get_project(project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="项目不存在"
            )
        
        # 验证项目所有权
        if project["user_id"] != current_user["id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="无权访问此项目"
            )
        
        return ProjectResponse(**project)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取项目失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取项目失败: {str(e)}"
        )

@router.put("/{project_id}", response_model=ProjectResponse, summary="更新项目")
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """更新项目信息"""
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
                detail="无权修改此项目"
            )
        
        # 准备更新数据
        update_data = project_update.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.now().isoformat()
        
        result = await db.update_project(project_id, update_data)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="更新项目失败"
            )
        
        return ProjectResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"更新项目失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新项目失败: {str(e)}"
        )

@router.delete("/{project_id}", response_model=SuccessResponse, summary="删除项目")
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """删除项目"""
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
                detail="无权删除此项目"
            )
        
        # 删除项目（在实际实现中可能需要软删除）
        # 这里简化为直接删除
        await db.delete_project(project_id)
        
        return SuccessResponse(
            message="项目删除成功",
            data={"project_id": project_id}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"删除项目失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除项目失败: {str(e)}"
        )

@router.post("/{project_id}/requirements", response_model=AgentResponse, summary="提交需求调研")
async def submit_requirements(
    project_id: str,
    requirements: RequirementsFormData,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
    gemini_client=Depends(get_gemini_client)
):
    """提交需求调研表单并生成主题建议"""
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
        
        # 使用Gemini分析需求并生成主题建议
        requirements_data = requirements.dict()
        theme_suggestions = await gemini_client.analyze_requirements(requirements_data)
        
        # 保存需求数据
        update_data = {
            "requirements_data": requirements_data,
            "status": "in_progress",
            "updated_at": datetime.now().isoformat()
        }
        
        await db.update_project(project_id, update_data)
        
        # 保存交互记录
        interaction_data = {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "stage": "requirements",
            "user_input": requirements_data,
            "ai_response": theme_suggestions,
            "timestamp": datetime.now().isoformat()
        }
        
        await db.save_interaction(interaction_data)
        
        return AgentResponse(
            status="success",
            stage="requirements",
            action="select_theme",
            data=theme_suggestions,
            message="基于您的需求，我为您推荐了以下项目主题"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"提交需求失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"提交需求失败: {str(e)}"
        )

@router.post("/{project_id}/theme", response_model=AgentResponse, summary="选择主题")
async def select_theme(
    project_id: str,
    theme_selection: ThemeSelection,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database),
    gemini_client=Depends(get_gemini_client)
):
    """选择主题并生成核心框架"""
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
        
        # 使用Gemini生成主题框架
        theme_data = theme_selection.dict()
        context = {
            "requirements": project.get("requirements_data", {}),
            "theme": theme_data
        }
        
        theme_framework = await gemini_client.generate_theme_framework(theme_data, context)
        
        # 保存主题设计数据
        update_data = {
            "theme_design_data": {
                "selected_theme": theme_data,
                "framework": theme_framework
            },
            "updated_at": datetime.now().isoformat()
        }
        
        await db.update_project(project_id, update_data)
        
        # 保存交互记录
        interaction_data = {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "stage": "theme_design",
            "user_input": theme_data,
            "ai_response": theme_framework,
            "timestamp": datetime.now().isoformat()
        }
        
        await db.save_interaction(interaction_data)
        
        return AgentResponse(
            status="success",
            stage="theme_design",
            action="confirm_framework",
            data=theme_framework,
            message="项目核心框架已生成，请确认并进入下一阶段"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"选择主题失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"选择主题失败: {str(e)}"
        )