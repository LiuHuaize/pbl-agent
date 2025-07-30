from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn
from config.settings import settings
from services.database import get_database
from api.routes import auth, projects, cards, interactions
from middleware.logging import LoggingMiddleware
from middleware.error_handling import ErrorHandlingMiddleware

# 创建安全实例
security = HTTPBearer()

# 应用生命周期管理
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时初始化
    print("PBL Agent 启动中...")
    
    # 初始化数据库连接
    db = get_database()
    await db.initialize()
    
    print("PBL Agent 启动完成！")
    yield
    
    # 关闭时清理
    print("PBL Agent 关闭中...")
    await db.close()
    print("PBL Agent 已关闭")

# 创建FastAPI应用
app = FastAPI(
    title="AI Agent辅助PBL教学设计工具",
    description="基于Gemini-2.5-Pro的四阶段PBL教学设计系统",
    version="1.0.0",
    lifespan=lifespan
)

# 配置CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # 使用配置的允许来源
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 添加自定义中间件
app.add_middleware(LoggingMiddleware)
app.add_middleware(ErrorHandlingMiddleware)

# 注册路由
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["项目"])
app.include_router(cards.router, prefix="/api/v1/cards", tags=["卡片"])
app.include_router(interactions.router, prefix="/api/v1/interactions", tags=["交互"])

# 健康检查
@app.get("/health", tags=["健康检查"])
async def health_check():
    return {"status": "healthy", "message": "PBL Agent运行正常"}

# 根路径
@app.get("/", tags=["根路径"])
async def root():
    return {
        "message": "欢迎使用AI Agent辅助PBL教学设计工具",
        "version": "1.0.0",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )