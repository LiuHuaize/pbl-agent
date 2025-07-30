from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from services.database import get_database
from config.settings import settings
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()

ALGORITHM = "HS256"

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_database)
):
    """获取当前用户信息"""
    try:
        # 验证令牌是否存在
        token = credentials.credentials
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="缺少访问令牌",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # 解析JWT令牌
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的令牌",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # 获取用户信息
        user = await db.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户不存在",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return user
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="令牌已过期",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"获取当前用户失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="身份验证失败"
        )

async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_database)
):
    """获取可选的用户信息（不强制要求登录）"""
    try:
        if not credentials:
            return None
        
        return await get_current_user(credentials, db)
    except HTTPException:
        return None
    except Exception:
        return None

def require_admin(current_user: dict = Depends(get_current_user)):
    """要求管理员权限"""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="需要管理员权限"
        )
    return current_user

async def validate_project_access(
    project_id: str, 
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """验证项目访问权限"""
    project = await db.get_project_by_user_and_id(current_user["id"], project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="项目不存在或无权限访问"
        )
    return project