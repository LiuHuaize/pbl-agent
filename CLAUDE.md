# CLAUDE.md

本文档为Claude Code (claude.ai/code)在此代码库中工作时提供指导。

## 项目概述

**AI Agent辅助PBL教学设计工具** - 基于Google Gemini-2.5-Pro的四阶段项目式学习(Project-Based Learning)教学设计系统，为教育工作者提供智能化的教学设计支持和个性化解决方案。

### 项目价值定位
- **智能化教学设计**：运用AI技术辅助教师快速生成高质量的PBL教学方案
- **四阶段科学流程**：遵循教育学理论，确保教学设计的系统性和科学性
- **个性化定制服务**：根据不同年级、学科、班级规模提供定制化教学方案
- **丰富教学资源库**：内置专业的教学卡片和工具模板，支持教学实施

### 核心技术架构
- **后端服务**：FastAPI (Python 3.11) + Supabase (PostgreSQL) + Redis缓存
- **前端应用**：Next.js 15 + React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **AI集成**：Google Gemini-2.5-Pro智能教学内容生成
- **认证系统**：基于JWT的安全认证机制

## 项目目录结构详解

```
/root/pbl-agent/
├── backend/                    # 后端服务核心
│   ├── api/                   # API路由层
│   │   ├── routes/           # 具体路由实现
│   │   │   ├── auth.py       # 用户认证接口
│   │   │   ├── projects.py   # 项目管理接口
│   │   │   ├── cards.py      # 教学卡片接口
│   │   │   └── interactions.py # AI交互接口
│   │   └── dependencies.py   # 依赖注入配置
│   ├── config/               # 配置管理
│   │   └── settings.py       # 应用配置设置
│   ├── models/               # 数据模型
│   │   └── schemas.py        # Pydantic数据验证模型
│   ├── services/             # 业务服务层
│   │   ├── database.py       # Supabase数据库服务
│   │   └── gemini_client.py  # Gemini AI客户端
│   ├── middleware/           # 中间件
│   │   ├── error_handling.py # 错误处理中间件
│   │   └── logging.py        # 日志中间件
│   ├── main.py              # FastAPI应用入口
│   ├── requirements.txt     # Python依赖包
│   └── pyproject.toml       # 项目配置和代码质量工具设置
├── frontend/                  # 前端应用
│   ├── app/                  # Next.js App Router应用
│   │   ├── page.tsx         # 主页面（教师工作台）
│   │   ├── layout.tsx       # 全局布局组件
│   │   ├── projects/        # 项目管理页面
│   │   ├── design/          # PBL设计流程页面
│   │   │   ├── [id]/       # 具体项目设计页面
│   │   │   └── new/        # 新建项目页面
│   │   ├── analytics/       # 数据分析页面
│   │   ├── resources/       # 教学资源库页面
│   │   ├── cases/          # 教学案例展示
│   │   ├── help/           # 帮助文档页面
│   │   └── profile/        # 用户个人资料
│   ├── components/          # React组件库
│   │   ├── ui/             # shadcn/ui基础组件
│   │   └── theme-provider.tsx # 主题提供者
│   ├── hooks/              # 自定义React Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数
│   ├── public/             # 静态资源
│   ├── package.json        # Node.js依赖配置
│   └── next.config.mjs     # Next.js配置
├── docs/                     # 项目文档
│   ├── design/              # 设计文档
│   │   ├── AI_Agent_PBL_实施计划.md     # 项目实施计划
│   │   ├── AI_Agent_技术实现方案.md     # 技术实现方案
│   │   └── PRD.md                      # 产品需求文档
│   └── openrouter/          # OpenRouter集成文档
│       └── openrouter_gemini_guide.md # Gemini集成指南
├── resources/               # 教学资源库（项目核心资产）
│   ├── pdf/                # 原始PDF教学资源
│   │   ├── PBL教学活动卡.pdf        # PBL活动卡片模板
│   │   ├── PBL教学工具卡.pdf        # PBL工具卡片模板  
│   │   ├── PBL教学合作卡.pdf        # PBL合作卡片模板
│   │   ├── 《长安的荔枝》3-4年级.pdf  # 具体教学案例
│   │   └── 亿小步课题开发方法论（1-3模块）.pdf # 教学方法论
│   └── extracted_texts/     # 提取的文本内容（AI训练数据）
│       ├── PBL教学活动卡.json/.txt   # 结构化活动卡片数据
│       ├── PBL教学工具卡.json/.txt   # 结构化工具卡片数据
│       ├── PBL教学合作卡.json/.txt   # 结构化合作卡片数据
│       ├── 《长安的荔枝》3-4年级.json/.txt # 案例文本数据
│       └── 亿小步课题开发方法论（1-3模块）.json/.txt # 方法论数据
├── config/                  # 基础设施配置
│   ├── docker-compose.yml   # Docker容器编排
│   └── redis.conf          # Redis配置文件
├── scripts/                 # 工具脚本
│   └── test_redis.sh       # Redis连接测试脚本
├── tests/                   # 测试套件
│   └── openrouter/         # OpenRouter相关测试
└── logs/                    # 运行日志
```

## PBL教学业务逻辑

### 四阶段教学设计流程

1. **需求调研阶段** (`requirements`)
   - 收集教学基本信息：年级、学科、班级人数、项目时长
   - 分析教学目标和特殊需求
   - 生成个性化教学约束条件

2. **主题设计阶段** (`theme_design`)  
   - 基于需求生成多个教学主题候选
   - 提供主题个性化定制选项
   - 确定项目核心问题和学习目标

3. **教学设计阶段** (`teaching_design`)
   - 制定详细的教学实施计划
   - 设计学习活动和评估方式
   - 规划时间节点和里程碑

4. **资源匹配阶段** (`resource_matching`)
   - 推荐合适的教学卡片组合
   - 匹配教学工具和模板
   - 生成完整的教学资源包

### 教学卡片系统

**活动卡片 (Activity Cards)**
- 包含学习目标、实施步骤、时间安排
- 支持1-5级难度分级
- 适配不同年级和学科特点

**工具卡片 (Tool Cards)**  
- 提供具体的教学工具和模板
- 包含使用指南和输出格式说明
- 支持数字化模板下载

**合作卡片 (Cooperation Cards)**
- 定义团队协作模式和角色分工
- 提供引导技巧和冲突解决方案
- 适配不同团队规模需求

## 开发环境配置

### 环境要求
- Python 3.11+
- Node.js 18+  
- Redis 6+
- Supabase账户
- Google Gemini API密钥

### 后端开发环境 (从 `/backend` 目录)

```bash
# 创建Python虚拟环境
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 安装依赖包
pip install -r requirements.txt

# 启动开发服务器
python main.py  # 运行在 http://localhost:8000

# 代码质量检查
black .                 # 代码格式化
isort .                 # 导入语句排序
flake8                  # 代码风格检查
mypy .                  # 类型检查
pytest                  # 运行测试套件
```

### 前端开发环境 (从 `/frontend` 目录)

```bash
# 安装依赖包
npm install
# 或使用 pnpm
pnpm install

# 启动开发服务器
npm run dev             # 运行在 http://localhost:3001

# 代码质量检查
npm run lint           # ESLint代码检查
npm run lint:fix       # 自动修复ESLint问题
npm run format         # Prettier代码格式化
npm run format:check   # 检查Prettier格式合规性
npm run type-check     # TypeScript类型检查

# 构建生产版本
npm run build          # 生产环境构建
npm run start          # 启动生产服务器
```

### 基础设施配置 (从 `/config` 目录)

```bash
# 启动Redis服务
docker-compose up -d

# 测试Redis连接 (从 `/scripts` 目录)
./test_redis.sh
```

## 环境变量配置

创建 `.env` 文件并配置以下必需变量：

```bash
# Supabase数据库配置
SUPABASE_URL=你的supabase项目URL
SUPABASE_ANON_KEY=你的supabase匿名密钥
SUPABASE_SERVICE_KEY=你的supabase服务密钥

# AI模型配置  
GEMINI_API_KEY=你的google_gemini_api密钥

# 安全配置
SECRET_KEY=你的jwt签名密钥_至少32位字符

# 缓存配置
REDIS_URL=redis://localhost:6379

# 开发环境配置
ALLOWED_ORIGINS=["http://localhost:3001", "http://localhost:3000"]
```

## 后端架构详解

### API接口结构
- **认证模块** (`/api/v1/auth`) - 用户注册、登录、JWT令牌管理
- **项目管理** (`/api/v1/projects`) - PBL项目的CRUD操作和阶段管理
- **卡片系统** (`/api/v1/cards`) - 教学资源卡片的查询和推荐
- **AI交互** (`/api/v1/interactions`) - 与Gemini模型的智能对话

### 核心组件说明
- **FastAPI应用** (`main.py`) - 应用入口点，包含中间件和路由配置
- **数据库服务** (`services/database.py`) - Supabase连接管理和数据操作
- **Gemini客户端** (`services/gemini_client.py`) - AI模型集成和提示工程
- **数据模型** (`models/schemas.py`) - Pydantic数据验证和序列化
- **自定义中间件** - 日志记录和错误处理

### 数据模型定义
- **项目状态**：`draft`(草稿), `in_progress`(进行中), `completed`(已完成)
- **项目阶段**：`requirements`, `theme_design`, `teaching_design`, `resource_matching`  
- **卡片类型**：`activity`(活动), `tool`(工具), `cooperation`(合作)

## 前端架构详解

### Next.js 15 App Router结构
- **主控制台** (`/app/page.tsx`) - 教师工作台主页面
- **项目管理** (`/app/projects/`) - 项目列表和管理界面
- **设计流程** (`/app/design/`) - 四阶段PBL设计向导
- **数据分析** (`/app/analytics/`) - 使用统计和效果分析
- **资源库** (`/app/resources/`) - 教学资源浏览和搜索

### UI组件生态
- **shadcn/ui组件库** - 位于 `/components/ui/` 的完整组件系统
- **主题管理** - 支持深色/浅色模式切换
- **表单处理** - React Hook Form + Zod数据验证
- **图表可视化** - Recharts用于数据分析展示

### 状态管理策略
- **本地状态**：React Hooks管理组件状态
- **全局状态**：Context API处理主题和认证状态
- **暂无**：外部状态管理库 (Redux, Zustand) 当前未实装

## AI集成最佳实践

### Gemini模型集成模式
- **服务层抽象** - 在services层封装Gemini客户端
- **结构化提示** - 针对四阶段PBL生成设计结构化提示词
- **卡片推荐算法** - 基于项目需求的智能卡片匹配
- **响应验证** - 使用Pydantic模型验证AI响应格式

### 中文教学内容处理
- **语言模型优化** - 针对中文教育术语和表达习惯调优
- **文化适应性** - 确保生成内容符合中国教育文化背景
- **专业术语库** - 维护教育领域专业词汇的准确性

## 教学资源管理指南

### resources目录管理原则
1. **PDF原始资源** (`/resources/pdf/`) - 保持教学资源的原始格式，便于人工审核
2. **结构化数据** (`/resources/extracted_texts/`) - AI训练和推理的数据源
3. **版本控制** - 所有教学资源变更必须经过审核和测试
4. **内容安全** - 确保所有教学内容符合教育规范和价值观

### 添加新教学资源流程
1. 在 `/resources/pdf/` 添加原始PDF文件
2. 使用文本提取工具生成JSON和TXT格式
3. 更新数据库中的资源索引
4. 测试AI模型对新资源的理解和推荐效果

## 开发规范与最佳实践

### 后端开发规范
- **异步编程**：所有FastAPI处理器使用async/await模式
- **依赖注入**：数据库和认证服务使用依赖注入
- **数据验证**：请求/响应使用Pydantic模型验证
- **错误处理**：自定义中间件统一处理错误和日志
- **生命周期管理**：合理管理数据库连接的生命周期

### 前端开发规范
- **服务端组件**：Next.js 15默认使用服务端组件
- **TypeScript严格模式**：确保类型安全和代码质量
- **CSS工具类**：使用Tailwind CSS进行样式管理
- **组件复用**：遵循shadcn/ui的组件组合模式
- **路由代码分割**：利用App Router的自动代码分割

### 教育软件特殊要求
- **内容安全性**：所有用户生成内容必须经过审核
- **用户友好性**：界面设计考虑教师用户的技术水平
- **数据隐私**：严格保护教师和学生的个人信息
- **可访问性**：确保应用符合无障碍访问标准

## 代码质量配置

### 后端代码质量工具 (pyproject.toml)
- **Black**：代码格式化，行长度100字符
- **isort**：导入语句排序和组织
- **mypy**：静态类型检查
- **pytest**：单元测试和集成测试
- **flake8**：代码风格和质量检查

### 前端代码质量工具
- **ESLint**：JavaScript/TypeScript代码检查
- **Prettier**：代码格式化和风格统一
- **TypeScript**：严格类型检查模式
- **标准配置**：遵循Next.js和React最佳实践

## API文档和调试

### 开发环境API文档
启动后端服务后，可访问以下文档：
- **Swagger UI**：http://localhost:8000/docs - 交互式API文档
- **ReDoc**：http://localhost:8000/redoc - 美观的API文档展示
- **健康检查**：http://localhost:8000/health - 服务状态监控

### 常用调试命令
```bash
# 后端日志查看
tail -f logs/mcp-puppeteer-*.log

# 数据库连接测试  
python -c "from services.database import get_database; print('DB连接正常')"

# Redis连接测试
redis-cli ping

# 前端开发者工具
npm run dev -- --inspect  # 启用Node.js调试
```

## 部署和运维

### Docker容器化部署
```bash
# 启动完整服务栈
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f
```

### 生产环境检查清单
- [ ] 环境变量安全配置
- [ ] 数据库连接池优化
- [ ] Redis缓存策略配置
- [ ] AI模型响应时间监控
- [ ] 用户数据备份策略
- [ ] 教学资源内容审核
- [ ] 系统性能监控报警

## 故障排除指南

### 常见问题解决
1. **Gemini API调用失败** - 检查API密钥和网络连接
2. **Supabase连接超时** - 验证数据库URL和权限配置
3. **Redis缓存异常** - 确认Redis服务状态和连接参数
4. **前端构建错误** - 检查Node.js版本和依赖包完整性
5. **AI内容生成异常** - 验证提示词格式和模型参数

### 日志分析方法
- **后端错误日志**：查看 `/logs/` 目录下的日志文件
- **前端构建日志**：检查npm/pnpm构建输出
- **数据库查询日志**：通过Supabase控制台监控
- **AI调用日志**：记录Gemini API的请求响应详情

---

**重要提示**：本项目专注于教育领域应用，所有开发和维护工作都应以提供高质量教学支持为目标，确保AI生成的教学内容科学、安全、适用。