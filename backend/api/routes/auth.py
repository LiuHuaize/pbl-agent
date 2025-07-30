from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from datetime import datetime, timedelta
import jwt
import bcrypt
import uuid
from services.database import get_database
from models.schemas import UserCreate, UserResponse, SuccessResponse, ErrorResponse
from pydantic import BaseModel, Field
from config.settings import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
security = HTTPBearer()

# JWT配置
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """  创建访问令牌 """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """  验证密码 """
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """  密码加密 """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

@router.post("/register", response_model=UserResponse, summary="用户注册")
async def register(
    user_data: UserCreate,
    db=Depends(get_database)
):
    """用户注册"""
    try:
        # 检查用户是否已存在
        existing_user = await db.get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该邮箱已被注册"
            )
        
        # 加密密码
        hashed_password = get_password_hash(user_data.password)
        
        # 创建用户数据
        user_create_data = {
            "id": str(uuid.uuid4()),
            "username": user_data.username,
            "email": user_data.email,
            "password_hash": hashed_password,
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        result = await db.create_user(user_create_data)
        if not result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="用户创建失败"
            )
        
        # 返回的用户信息不包含密码
        user_response = UserResponse(
            id=result["id"],
            username=result["username"],
            email=result["email"],
            created_at=result["created_at"],
            updated_at=result["updated_at"]
        )
        
        return user_response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"用户注册失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"注册失败: {str(e)}"
        )

class LoginRequest(BaseModel):
    email: str = Field(..., description="邮箱")
    password: str = Field(..., min_length=6, description="密码")

@router.post("/login", summary="用户登录")
async def login(
    login_data: LoginRequest,
    db=Depends(get_database)
):
    """用户登录"""
    try:
        # 查找用户
        user = await db.get_user_by_email(login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="邮箱或密码错误"
            )
        
        # 验证密码
        if not verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="邮箱或密码错误"
            )
        
        # 创建访问令牌
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["id"], "email": user["email"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"用户登录失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"登录失败: {str(e)}"
        )

@router.post("/logout", response_model=SuccessResponse, summary="用户登出")
async def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """用户登出（客户端删除令牌）"""
    # 在实际应用中，可以将令牌加入黑名单
    # 这里简化处理
    return SuccessResponse(
        message="登出成功",
        data={"logout_time": datetime.now().isoformat()}
    )

@router.get("/me", response_model=UserResponse, summary="获取当前用户信息")
async def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db=Depends(get_database)
):
    """获取当前用户信息"""
    try:
        # 解析JWT令牌
        token = credentials.credentials
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="缺少访问令牌"
            )
        
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的令牌"
            )
        
        # 获取用户信息
        user = await db.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户不存在"
            )
        
        return UserResponse(
            id=user["id"],
            username=user["username"],
            email=user["email"],
            created_at=user["created_at"],
            updated_at=user["updated_at"]
        )
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="令牌已过期"
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的令牌"
        )
    except Exception as e:
        logger.error(f"获取用户信息失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取用户信息失败: {str(e)}"
        )