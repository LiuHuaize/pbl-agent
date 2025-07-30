from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# 枚举类型定义
class ProjectStatus(str, Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class ProjectStage(str, Enum):
    REQUIREMENTS = "requirements"
    THEME_DESIGN = "theme_design"
    TEACHING_DESIGN = "teaching_design"
    RESOURCE_MATCHING = "resource_matching"

class CardType(str, Enum):
    ACTIVITY = "activity"
    TOOL = "tool"
    COOPERATION = "cooperation"

# 用户相关Schema
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., pattern=r'^[\w\.-]+@[\w\.-]+\.\w+$')

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

# 项目相关Schema
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[ProjectStatus] = None
    requirements_data: Optional[Dict[str, Any]] = None
    theme_design_data: Optional[Dict[str, Any]] = None
    teaching_design_data: Optional[Dict[str, Any]] = None
    resource_data: Optional[Dict[str, Any]] = None
    final_solution: Optional[Dict[str, Any]] = None

class ProjectResponse(ProjectBase):
    id: str
    user_id: str
    status: ProjectStatus
    created_at: datetime
    updated_at: datetime
    requirements_data: Optional[Dict[str, Any]] = None
    theme_design_data: Optional[Dict[str, Any]] = None
    teaching_design_data: Optional[Dict[str, Any]] = None
    resource_data: Optional[Dict[str, Any]] = None
    final_solution: Optional[Dict[str, Any]] = None

# 需求调研Schema
class RequirementsFormData(BaseModel):
    grade: str = Field(..., description="年级")
    subject: str = Field(..., description="主要学科")
    class_size: int = Field(..., ge=1, le=100, description="班级人数")
    duration: str = Field(..., description="项目时长")
    teaching_goals: str = Field(..., min_length=10, description="教学目标")
    additional_requirements: Optional[str] = Field(None, description="额外需求")

# 主题设计Schema
class ThemeSelection(BaseModel):
    theme_id: str = Field(..., description="主题ID")
    theme_name: str = Field(..., description="主题名称")
    theme_description: str = Field(..., description="主题描述")
    customization: Optional[Dict[str, Any]] = Field(None, description="个性化调整")

# 交互相关Schema
class UserInteraction(BaseModel):
    action: str = Field(..., description="交互动作")
    stage: ProjectStage = Field(..., description="当前阶段")
    data: Dict[str, Any] = Field(..., description="交互数据")
    timestamp: Optional[datetime] = Field(None, description="时间戳")

class AgentResponse(BaseModel):
    status: str = Field(..., description="响应状态")
    stage: ProjectStage = Field(..., description="当前阶段")
    action: str = Field(..., description="下一步动作")
    data: Dict[str, Any] = Field(..., description="响应数据")
    message: str = Field(..., description="消息")
    timestamp: datetime = Field(default_factory=datetime.now)

# 卡片相关Schema
class ActivityCard(BaseModel):
    id: str = Field(..., description="卡片ID")
    name: str = Field(..., description="卡片名称")
    description: str = Field(..., description="卡片描述")
    stage: str = Field(..., description="适用阶段")
    duration: Optional[str] = Field(None, description="时间要求")
    objectives: Optional[List[str]] = Field(None, description="学习目标")
    difficulty_level: Optional[int] = Field(None, ge=1, le=5, description="难度等级")
    grade_levels: Optional[List[str]] = Field(None, description="适用年级")
    subjects: Optional[List[str]] = Field(None, description="适用学科")
    implementation_tips: Optional[str] = Field(None, description="实施要点")
    resources_needed: Optional[List[str]] = Field(None, description="所需资源")

class ToolCard(BaseModel):
    id: str = Field(..., description="卡片ID")
    name: str = Field(..., description="卡片名称")
    description: str = Field(..., description="卡片描述")
    category: str = Field(..., description="工具类别")
    usage_guide: Optional[str] = Field(None, description="使用指南")
    template_content: Optional[str] = Field(None, description="模板内容")
    compatible_activities: Optional[List[str]] = Field(None, description="兼容活动")
    output_format: Optional[str] = Field(None, description="输出格式")
    digital_template_path: Optional[str] = Field(None, description="数字模板路径")

class CooperationCard(BaseModel):
    id: str = Field(..., description="卡片ID")
    name: str = Field(..., description="卡片名称")
    description: str = Field(..., description="卡片描述")
    phase: str = Field(..., description="合作阶段")
    team_size_range: Optional[str] = Field(None, description="团队规模")
    usage_scenario: Optional[str] = Field(None, description="使用场景")
    facilitation_guide: Optional[str] = Field(None, description="引导指南")

# 卡片推荐Schema
class CardRecommendation(BaseModel):
    activity_cards: List[ActivityCard] = Field(..., description="推荐活动卡")
    tool_cards: List[ToolCard] = Field(..., description="推荐工具卡")
    cooperation_cards: List[CooperationCard] = Field(..., description="推荐合作卡")
    rationale: str = Field(..., description="推荐理由")
    confidence_score: float = Field(..., ge=0, le=1, description="置信度")

# 导出相关Schema
class ExportRequest(BaseModel):
    project_id: str = Field(..., description="项目ID")
    format: str = Field(..., description="导出格式")
    include_templates: bool = Field(True, description="是否包含模板")
    custom_template: Optional[str] = Field(None, description="自定义模板")

class ExportResponse(BaseModel):
    file_path: str = Field(..., description="文件路径")
    file_size: int = Field(..., description="文件大小")
    export_time: datetime = Field(..., description="导出时间")
    format: str = Field(..., description="导出格式")

# 错误响应Schema
class ErrorResponse(BaseModel):
    error: str = Field(..., description="错误类型")
    message: str = Field(..., description="错误消息")
    details: Optional[Dict[str, Any]] = Field(None, description="错误详情")
    timestamp: datetime = Field(default_factory=datetime.now)

# 成功响应Schema
class SuccessResponse(BaseModel):
    success: bool = Field(True, description="是否成功")
    message: str = Field(..., description="成功消息")
    data: Optional[Dict[str, Any]] = Field(None, description="响应数据")
    timestamp: datetime = Field(default_factory=datetime.now)