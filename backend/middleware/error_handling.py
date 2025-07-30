from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime
import logging
import traceback

logger = logging.getLogger(__name__)

class ErrorHandlingMiddleware(BaseHTTPMiddleware):
    """全局错误处理中间件"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except HTTPException as e:
            # HTTP异常直接抛出
            raise e
        except Exception as e:
            # 记录未捕获的异常
            request_id = getattr(request.state, 'request_id', 'unknown')
            logger.error(
                f"[{request_id}] Unhandled exception: {str(e)}\n{traceback.format_exc()}"
            )
            
            # 返回通用错误响应
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={
                    "error": "internal_server_error",
                    "message": "服务器内部错误，请稍后再试",
                    "details": None,  # 生产环境不暴露错误详情
                    "timestamp": datetime.now().isoformat(),
                    "request_id": request_id
                }
            )

class ValidationErrorMiddleware(BaseHTTPMiddleware):
    """数据验证错误处理中间件"""
    
    async def dispatch(self, request: Request, call_next):
        try:
            response = await call_next(request)
            return response
        except ValueError as e:
            # 数据验证错误
            request_id = getattr(request.state, 'request_id', 'unknown')
            logger.warning(f"[{request_id}] Validation error: {str(e)}")
            
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={
                    "error": "validation_error",
                    "message": "数据验证失败",
                    "details": str(e),
                    "timestamp": datetime.now().isoformat(),
                    "request_id": request_id
                }
            )

class RateLimitMiddleware(BaseHTTPMiddleware):
    """限流中间件（简化版）"""
    
    def __init__(self, app, calls_per_minute: int = 60):
        super().__init__(app)
        self.calls_per_minute = calls_per_minute
        self.calls = {}
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = datetime.now()
        
        # 简化的限流逻辑（在实际应用中应使用Redis等缓存）
        if client_ip not in self.calls:
            self.calls[client_ip] = []
        
        # 清理过期记录
        self.calls[client_ip] = [
            call_time for call_time in self.calls[client_ip]
            if (current_time - call_time).total_seconds() < 60
        ]
        
        # 检查限流
        if len(self.calls[client_ip]) >= self.calls_per_minute:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "error": "rate_limit_exceeded",
                    "message": "请求太频繁，请稍后再试",
                    "details": f"每分钟最多{self.calls_per_minute}次请求",
                    "timestamp": current_time.isoformat()
                }
            )
        
        # 记录请求
        self.calls[client_ip].append(current_time)
        
        return await call_next(request)


def setup_exception_handlers(app):
    """设置异常处理器"""
    
    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """HTTP异常处理器"""
        request_id = getattr(request.state, 'request_id', 'unknown')
        logger.warning(f"[{request_id}] HTTP {exc.status_code}: {exc.detail}")
        
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "http_error",
                "message": exc.detail,
                "details": None,
                "timestamp": datetime.now().isoformat(),
                "request_id": request_id
            }
        )
    
    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        """值错误处理器"""
        request_id = getattr(request.state, 'request_id', 'unknown')
        logger.warning(f"[{request_id}] ValueError: {str(exc)}")
        
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "error": "validation_error",
                "message": "数据验证失败",
                "details": str(exc),
                "timestamp": datetime.now().isoformat(),
                "request_id": request_id
            }
        )
    
    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        """通用异常处理器"""
        request_id = getattr(request.state, 'request_id', 'unknown')
        logger.error(
            f"[{request_id}] Unhandled exception: {str(exc)}\n{traceback.format_exc()}"
        )
        
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "internal_server_error",
                "message": "服务器内部错误，请稍后再试",
                "details": None,
                "timestamp": datetime.now().isoformat(),
                "request_id": request_id
            }
        )