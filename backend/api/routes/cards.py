from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from services.database import get_database
from models.schemas import ActivityCard, ToolCard, CooperationCard, CardRecommendation
from api.dependencies import get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/activities", response_model=List[ActivityCard], summary="获取活动卡")
async def get_activity_cards(
    stage: Optional[str] = Query(None, description="阶段过滤"),
    grade: Optional[str] = Query(None, description="年级过滤"),
    subject: Optional[str] = Query(None, description="学科过滤"),
    difficulty: Optional[int] = Query(None, ge=1, le=5, description="难度过滤"),
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """获取活动卡列表或根据条件过滤"""
    try:
        # 构建过滤条件
        filters = {}
        if stage:
            filters["stage"] = stage
        if grade:
            # 假设数据库中存储的是JSON数组格式
            filters["grade_levels"] = grade
        if subject:
            filters["subjects"] = subject
        if difficulty:
            filters["difficulty_level"] = difficulty
        
        cards = await db.get_activity_cards(filters)
        return [ActivityCard(**card) for card in cards]
        
    except Exception as e:
        logger.error(f"获取活动卡失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取活动卡失败: {str(e)}"
        )

@router.get("/activities/{card_id}", response_model=ActivityCard, summary="获取指定活动卡")
async def get_activity_card(
    card_id: str,
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """获取指定活动卡详情"""
    try:
        cards = await db.get_activity_cards({"id": card_id})
        if not cards:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="活动卡不存在"
            )
        
        return ActivityCard(**cards[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取活动卡失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取活动卡失败: {str(e)}"
        )

@router.get("/tools", response_model=List[ToolCard], summary="获取工具卡")
async def get_tool_cards(
    category: Optional[str] = Query(None, description="分类过滤"),
    compatible_activity: Optional[str] = Query(None, description="兼容活动过滤"),
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """获取工具卡列表或根据条件过滤"""
    try:
        # 构建过滤条件
        filters = {}
        if category:
            filters["category"] = category
        if compatible_activity:
            filters["compatible_activities"] = compatible_activity
        
        cards = await db.get_tool_cards(filters)
        return [ToolCard(**card) for card in cards]
        
    except Exception as e:
        logger.error(f"获取工具卡失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取工具卡失败: {str(e)}"
        )

@router.get("/tools/{card_id}", response_model=ToolCard, summary="获取指定工具卡")
async def get_tool_card(
    card_id: str,
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """获取指定工具卡详情"""
    try:
        cards = await db.get_tool_cards({"id": card_id})
        if not cards:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="工具卡不存在"
            )
        
        return ToolCard(**cards[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取工具卡失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取工具卡失败: {str(e)}"
        )

@router.get("/cooperation", response_model=List[CooperationCard], summary="获取合作卡")
async def get_cooperation_cards(
    phase: Optional[str] = Query(None, description="阶段过滤"),
    team_size: Optional[str] = Query(None, description="团队规模过滤"),
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """获取合作卡列表或根据条件过滤"""
    try:
        # 构建过滤条件
        filters = {}
        if phase:
            filters["phase"] = phase
        if team_size:
            filters["team_size_range"] = team_size
        
        cards = await db.get_cooperation_cards(filters)
        return [CooperationCard(**card) for card in cards]
        
    except Exception as e:
        logger.error(f"获取合作卡失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取合作卡失败: {str(e)}"
        )

@router.get("/cooperation/{card_id}", response_model=CooperationCard, summary="获取指定合作卡")
async def get_cooperation_card(
    card_id: str,
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """获取指定合作卡详情"""
    try:
        cards = await db.get_cooperation_cards({"id": card_id})
        if not cards:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="合作卡不存在"
            )
        
        return CooperationCard(**cards[0])
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取合作卡失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取合作卡失败: {str(e)}"
        )

@router.get("/recommend", response_model=CardRecommendation, summary="获取卡片推荐")
async def get_card_recommendations(
    stage: str = Query(..., description="项目阶段"),
    grade: str = Query(..., description="年级"),
    subject: str = Query(..., description="学科"),
    class_size: int = Query(..., description="班级人数"),
    db=Depends(get_database),
    current_user: dict = Depends(get_current_user)
):
    """基于项目信息推荐卡片组合"""
    try:
        # 构建推荐条件
        context = {
            "stage": stage,
            "grade": grade,
            "subject": subject,
            "class_size": class_size
        }
        
        # 获取符合条件的卡片
        activity_filters = {"stage": stage, "grade_levels": grade, "subjects": subject}
        activity_cards = await db.get_activity_cards(activity_filters)
        
        # 简化推荐逻辑，在实际应用中应使用更复杂的算法
        recommended_activities = activity_cards[:3] if len(activity_cards) >= 3 else activity_cards
        
        # 为每个活动卡匹配工具卡和合作卡
        recommended_tools = []
        recommended_cooperation = []
        
        for activity in recommended_activities:
            # 获取推荐的工具卡
            if activity.get("recommended_tools"):
                tool_filters = {"id": activity["recommended_tools"]}
                tools = await db.get_tool_cards(tool_filters)
                recommended_tools.extend(tools)
            
            # 获取推荐的合作卡
            if activity.get("recommended_cooperation"):
                cooperation_filters = {"id": activity["recommended_cooperation"]}
                cooperation = await db.get_cooperation_cards(cooperation_filters)
                recommended_cooperation.extend(cooperation)
        
        # 去重
        unique_tools = {tool["id"]: tool for tool in recommended_tools}.values()
        unique_cooperation = {coop["id"]: coop for coop in recommended_cooperation}.values()
        
        return CardRecommendation(
            activity_cards=[ActivityCard(**card) for card in recommended_activities],
            tool_cards=[ToolCard(**card) for card in unique_tools],
            cooperation_cards=[CooperationCard(**card) for card in unique_cooperation],
            rationale=f"基于{stage}阶段、{grade}、{subject}的需求匹配的卡片组合",
            confidence_score=0.8
        )
        
    except Exception as e:
        logger.error(f"获取卡片推荐失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取卡片推荐失败: {str(e)}"
        )