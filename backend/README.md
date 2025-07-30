# PBL Agent后端服务

基于FastAPI和Gemini-2.5-Pro的PBL教学设计工具后端服务。

## 项目结构

```
backend/
├── main.py                 # 应用入口文件
├── config/                # 配置文件
│   ├── __init__.py
│   └── settings.py        # 应用设置
├── models/                # 数据模型
│   ├── __init__.py
│   └── schemas.py         # Pydantic模型
├── services/              # 业务服务
│   ├── database.py        # 数据库服务
│   └── gemini_client.py   # AI模型服务
├── api/                   # API路由
│   ├── routes/
│   │   ├── auth.py        # 身份认证
│   │   ├── projects.py    # 项目管理
│   │   ├── cards.py       # 卡片管理
│   │   └── interactions.py # 交互处理
│   └── dependencies.py    # 依赖注入
├── middleware/            # 中间件
│   ├── logging.py         # 日志中间件
│   └── error_handling.py  # 错误处理
├── .env.example           # 环境变量示例
├── requirements.txt       # 项目依赖
└── README.md             # 项目说明
```

## 快速开始

### 1. 安装依赖

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/Mac
# 或
venv\Scripts\activate  # Windows

# 安装依赖
pip install -r requirements.txt
```

### 2. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入正确的配置参数
nano .env
```

### 3. 运行应用

```bash
# 开发模式
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 或者直接运行
python main.py
```

### 4. 访问应用

- API文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/health

## 核心功能

### 身份认证
- 用户注册和登录
- JWT令牌认证
- 密码加密存储

### 项目管理
- 创建、更新、删除项目
- 四阶段流程管理
- 项目数据持久化

### AI交互
- Gemini-2.5-Pro集成
- 流式响应支持
- 上下文管理

### 卡片系统
- 活动卡、工具卡、合作卡管理
- 智能卡片推荐
- 卡片关联匹配

## API接口

### 身份认证
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/login` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息

### 项目管理
- `POST /api/v1/projects` - 创建项目
- `GET /api/v1/projects` - 获取用户项目列表
- `GET /api/v1/projects/{project_id}` - 获取项目详情
- `PUT /api/v1/projects/{project_id}` - 更新项目
- `POST /api/v1/projects/{project_id}/requirements` - 提交需求调研
- `POST /api/v1/projects/{project_id}/theme` - 选择主题

### 卡片管理
- `GET /api/v1/cards/activities` - 获取活动卡
- `GET /api/v1/cards/tools` - 获取工具卡
- `GET /api/v1/cards/cooperation` - 获取合作卡
- `GET /api/v1/cards/recommend` - 获取卡片推荐

### 交互处理
- `POST /api/v1/interactions/process` - 处理用户交互
- `POST /api/v1/interactions/stream` - 流式交互处理
- `GET /api/v1/interactions/history/{project_id}` - 获取交互历史

## 开发指南

### 代码风格

项目使用以下代码规范工具：

```bash
# 代码格式化
black .

# 导入排序
isort .

# 代码检查
flake8 .

# 类型检查
mypy .
```

### 测试

```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_auth.py

# 运行测试并生成覆盖率报告
pytest --cov=.
```

### 日志管理

项目使用结构化日志，日志文件位于 `logs/` 目录下。

## 部署

### Docker部署

```bash
# 构建镜像
docker build -t pbl-agent-backend .

# 运行容器
docker run -p 8000:8000 --env-file .env pbl-agent-backend
```

### 生产环境

```bash
# 使用gunicorn运行
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

## 相关链接

- [FastAPI文档](https://fastapi.tiangolo.com/)
- [Supabase文档](https://supabase.com/docs)
- [Gemini API文档](https://ai.google.dev/docs)
- [Pydantic文档](https://docs.pydantic.dev/)

## 许可证

MIT License