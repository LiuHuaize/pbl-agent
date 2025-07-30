from supabase import create_client, Client
from typing import Optional, Dict, Any, List
import asyncio
import json
from datetime import datetime
from config.settings import settings

class SupabaseDatabase:
    """Supabase数据库服务类"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self.url = settings.SUPABASE_URL
        self.anon_key = settings.SUPABASE_ANON_KEY
        self.service_key = settings.SUPABASE_SERVICE_KEY
    
    async def initialize(self):
        """  初始化数据库连接 """
        try:
            self.client = create_client(self.url, self.anon_key)
            print("Supabase数据库连接成功")
            
            # 测试连接
            await self.test_connection()
            
        except Exception as e:
            print(f"Supabase数据库连接失败: {e}")
            raise
    
    async def test_connection(self):
        """  测试数据库连接 """
        try:
            # 尝试查询系统表
            response = self.client.table("users").select("count").execute()
            print(f"Supabase连接测试成功")
            return True
        except Exception as e:
            print(f"Supabase连接测试失败: {e}")
            return False
    
    async def close(self):
        """  关闭数据库连接 """
        if self.client:
            # Supabase客户端不需要显式关闭
            print("Supabase数据库连接已关闭")
    
    # 用户管理
    async def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """  创建用户 """
        try:
            response = self.client.table("users").insert(user_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"创建用户失败: {e}")
            raise
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """获取用户信息"""
        try:
            response = self.client.table("users").select("*").eq("id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"获取用户失败: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """根据邮箱获取用户信息"""
        try:
            response = self.client.table("users").select("*").eq("email", email).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"根据邮箱获取用户失败: {e}")
            return None
    
    # 项目管理
    async def create_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """  创建项目 """
        try:
            response = self.client.table("projects").insert(project_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"创建项目失败: {e}")
            raise
    
    async def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        """  获取项目信息 """
        try:
            response = self.client.table("projects").select("*").eq("id", project_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"获取项目失败: {e}")
            return None
    
    async def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        """  获取用户所有项目 """
        try:
            response = self.client.table("projects").select("*").eq("user_id", user_id).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"获取用户项目失败: {e}")
            return []
    
    async def update_project(self, project_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """  更新项目 """
        try:
            response = self.client.table("projects").update(updates).eq("id", project_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"更新项目失败: {e}")
            raise
    
    # 卡片管理
    async def get_activity_cards(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """  获取活动卡 """
        try:
            query = self.client.table("activity_cards").select("*")
            
            if filters:
                for key, value in filters.items():
                    if isinstance(value, list):
                        query = query.in_(key, value)
                    else:
                        query = query.eq(key, value)
            
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"获取活动卡失败: {e}")
            return []
    
    async def get_tool_cards(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """  获取工具卡 """
        try:
            query = self.client.table("tool_cards").select("*")
            
            if filters:
                for key, value in filters.items():
                    if isinstance(value, list):
                        query = query.in_(key, value)
                    else:
                        query = query.eq(key, value)
            
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"获取工具卡失败: {e}")
            return []
    
    async def get_cooperation_cards(self, filters: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """  获取合作卡 """
        try:
            query = self.client.table("cooperation_cards").select("*")
            
            if filters:
                for key, value in filters.items():
                    if isinstance(value, list):
                        query = query.in_(key, value)
                    else:
                        query = query.eq(key, value)
            
            response = query.execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"获取合作卡失败: {e}")
            return []
    
    # 交互记录管理
    async def save_interaction(self, interaction_data: Dict[str, Any]) -> Dict[str, Any]:
        """保存交互记录"""
        try:
            # 添加时间戳
            if 'timestamp' not in interaction_data:
                interaction_data['timestamp'] = self.get_current_timestamp()
            
            response = self.client.table("project_interactions").insert(interaction_data).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"保存交互记录失败: {e}")
            raise
    
    async def get_project_interactions(self, project_id: str) -> List[Dict[str, Any]]:
        """  获取项目交互记录 """
        try:
            response = self.client.table("project_interactions").select("*").eq("project_id", project_id).order("timestamp", desc=False).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"获取交互记录失败: {e}")
            return []

    async def health_check(self) -> bool:
        """健康检查"""
        try:
            if not self.client:
                return False
            # 简单查询测试连接
            response = self.client.table("users").select("count").limit(1).execute()
            return True
        except Exception as e:
            print(f"健康检查失败: {e}")
            return False
    
    async def delete_project(self, project_id: str) -> bool:
        """删除项目"""
        try:
            response = self.client.table("projects").delete().eq("id", project_id).execute()
            return len(response.data) > 0
        except Exception as e:
            print(f"删除项目失败: {e}")
            return False
    
    async def get_project_by_user_and_id(self, user_id: str, project_id: str) -> Optional[Dict[str, Any]]:
        """获取用户的特定项目"""
        try:
            response = self.client.table("projects").select("*").eq("id", project_id).eq("user_id", user_id).execute()
            return response.data[0] if response.data else None
        except Exception as e:
            print(f"获取用户项目失败: {e}")
            return None
    
    def get_current_timestamp(self) -> str:
        """获取当前时间戳"""
        return datetime.now().isoformat()

# 数据库管理器类
class DatabaseManager:
    """数据库管理器"""
    
    def __init__(self):
        self.database = SupabaseDatabase()
    
    async def connect(self):
        """连接数据库"""
        await self.database.initialize()
    
    async def disconnect(self):
        """断开数据库连接"""
        await self.database.close()
    
    async def health_check(self) -> bool:
        """健康检查"""
        return await self.database.health_check()
    
    def get_current_timestamp(self) -> str:
        """获取当前时间戳"""
        return self.database.get_current_timestamp()

# 全局数据库管理器实例
database_manager = DatabaseManager()

# 兼容旧的接口
def get_database() -> SupabaseDatabase:
    """获取数据库实例 (保留兼容性)"""
    return database_manager.database