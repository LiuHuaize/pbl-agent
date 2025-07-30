from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # 项目基础配置
    PROJECT_NAME: str = "PBL Agent"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Supabase配置
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    
    # AI模型配置
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-2.5-pro"
    MAX_TOKENS: int = 4000
    TEMPERATURE: float = 0.7
    
    # Redis配置
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD")
    
    # 安全配置
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_HOSTS: List[str] = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    
    # 文件存储配置
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/pbl_agent.log"
    
    # 环境配置
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 全局设置实例
settings = Settings()

# 验证必需配置
def validate_settings():
    """  验证必需的环境变量是否已设置 """
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_ANON_KEY", 
        "GEMINI_API_KEY",
        "SECRET_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not getattr(settings, var):
            missing_vars.append(var)
    
    if missing_vars:
        raise ValueError(f"缺少必需的环境变量: {', '.join(missing_vars)}")
    
    # 验证SECRET_KEY强度
    if len(settings.SECRET_KEY) < 32:
        raise ValueError("密钥长度必须至少32位")
    
    print("所有必需的环境变量已配置")
    return True