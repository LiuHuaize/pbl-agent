#!/usr/bin/env python3
"""
PBL Agent后端服务启动脚本
"""
import uvicorn
import sys
import os

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from config.settings import settings, validate_settings

def main():
    """主启动函数"""
    try:
        # 验证必需的环境变量
        validate_settings()
        
        print("=" * 50)
        print("🚀 启动 AI Agent PBL教学设计工具后端服务")
        print(f"📊 项目名称: {settings.PROJECT_NAME}")
        print(f"🏷️  版本: {settings.VERSION}")
        print(f"🌐 地址: http://{settings.HOST}:{settings.PORT}")
        print(f"📖 API文档: http://{settings.HOST}:{settings.PORT}/docs")
        print(f"🏃 环境: {settings.ENVIRONMENT}")
        print("=" * 50)
        
        # 启动uvicorn服务器
        uvicorn.run(
            "main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=settings.DEBUG,
            log_level="info",
            access_log=True,
            loop="auto"
        )
        
    except ValueError as e:
        print(f"❌ 配置错误: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\n👋 服务已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()