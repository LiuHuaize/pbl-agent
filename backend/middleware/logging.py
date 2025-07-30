from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import logging
import time
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

class LoggingMiddleware(BaseHTTPMiddleware):
    """请求日志中间件"""
    
    async def dispatch(self, request: Request, call_next):
        # 生成请求ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # 记录请求开始时间
        start_time = time.time()
        
        # 记录请求信息
        client_ip = request.client.host
        method = request.method
        url = str(request.url)
        user_agent = request.headers.get("user-agent", "")
        
        logger.info(
            f"[{request_id}] {method} {url} - IP: {client_ip} - UserAgent: {user_agent[:100]}"
        )
        
        try:
            # 处理请求
            response = await call_next(request)
            
            # 计算处理时间
            process_time = time.time() - start_time
            
            # 记录响应信息
            logger.info(
                f"[{request_id}] {method} {url} - {response.status_code} - {process_time:.3f}s"
            )
            
            # 添加响应头
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = str(process_time)
            
            return response
            
        except Exception as e:
            # 记录异常信息
            process_time = time.time() - start_time
            logger.error(
                f"[{request_id}] {method} {url} - ERROR: {str(e)} - {process_time:.3f}s"
            )
            raise

class RequestContextMiddleware(BaseHTTPMiddleware):
    """请求上下文中间件"""
    
    async def dispatch(self, request: Request, call_next):
        # 添加请求时间戳
        request.state.start_time = datetime.now()
        
        # 添加请求元数据
        request.state.client_ip = request.client.host
        request.state.method = request.method
        request.state.path = request.url.path
        
        # 处理请求
        response = await call_next(request)
        
        # 添加响应时间
        request.state.end_time = datetime.now()
        request.state.duration = (request.state.end_time - request.state.start_time).total_seconds()
        
        return response


def setup_logging():
    """设置日志配置"""
    import logging.config
    
    # 日志配置
    LOGGING_CONFIG = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "default",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "detailed",
                "filename": "logs/pbl_agent.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "encoding": "utf8",
            },
        },
        "loggers": {
            "": {  # root logger
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False,
            },
            "uvicorn.error": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["console"],
                "propagate": False,
            },
        },
    }
    
    # 创建日志目录
    import os
    os.makedirs("logs", exist_ok=True)
    
    # 应用日志配置
    logging.config.dictConfig(LOGGING_CONFIG)
    logging.info("日志系统初始化完成")