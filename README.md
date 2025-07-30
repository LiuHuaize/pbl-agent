# AI Agent辅助PBL教学设计工具

基于Gemini-2.5-Pro的四阶段PBL教学设计系统，为教育工作者提供智能化的项目式学习设计支持。

## 🚀 项目特性

- **智能化设计**: 基于AI的PBL教学方案生成
- **四阶段流程**: 需求调研 → 主题设计 → 教学设计 → 资源匹配
- **个性化定制**: 根据不同教学场景提供定制化解决方案
- **资源丰富**: 内置多种教学卡片和工具模板

## 🏗️ 技术架构

### 后端
- **框架**: FastAPI + Python 3.11
- **数据库**: Supabase (PostgreSQL)
- **缓存**: Redis
- **AI模型**: Google Gemini-2.5-Pro
- **认证**: JWT Token

### 前端
- **框架**: Next.js 15 + React 19
- **样式**: Tailwind CSS + shadcn/ui
- **语言**: TypeScript
- **状态管理**: React Hooks

## 📋 环境要求

- Python 3.11+
- Node.js 18+
- Redis 6+
- Supabase 账户
- Google Gemini API Key

## 🛠️ 安装配置

### 1. 克隆项目

```bash
git clone <repository-url>
cd pbl-agent
```

### 2. 后端配置

```bash
cd backend

# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp ../.env.example .env
# 编辑 .env 文件，填入实际配置
```

### 3. 前端配置

```bash
cd frontend

# 安装依赖
npm install
# 或使用 pnpm
pnpm install
```

### 4. 启动服务

```bash
# 启动后端 (在 backend 目录)
python main.py

# 启动前端 (在 frontend 目录)
npm run dev
```

## 📝 开发规范

### 代码质量

项目已配置完整的代码质量工具链：

#### 后端代码质量
```bash
# 代码格式化
black .
isort .

# 代码检查
flake8
mypy .

# 运行测试
pytest
```

#### 前端代码质量
```bash
# 代码检查
npm run lint
npm run lint:fix

# 代码格式化
npm run format
npm run format:check

# 类型检查
npm run type-check
```

### 环境变量

复制 `.env.example` 到 `.env` 并配置以下必需变量：

- `SUPABASE_URL`: Supabase项目URL
- `SUPABASE_ANON_KEY`: Supabase匿名密钥
- `SUPABASE_SERVICE_KEY`: Supabase服务密钥
- `GEMINI_API_KEY`: Google Gemini API密钥
- `SECRET_KEY`: JWT签名密钥（至少32位）
- `REDIS_URL`: Redis连接URL

## 🧪 测试

```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
npm test
```

## 📚 API文档

启动后端服务后，访问以下地址查看API文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔄 部署

### Docker部署 (推荐)

```bash
# 构建并启动所有服务
docker-compose up -d
```

### 手动部署

1. 配置生产环境变量
2. 构建前端应用
3. 启动后端服务
4. 配置反向代理 (Nginx/Apache)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/新功能`)
3. 提交更改 (`git commit -am '添加新功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如有问题或建议，请：

1. 查看现有 [Issues](../../issues)
2. 创建新的 Issue
3. 联系开发团队

## 🔗 相关链接

- [项目文档](./docs/)
- [API参考](./docs/api/)
- [设计文档](./docs/design/)