# AI Agent辅助PBL教学设计工具

## 项目概述

这是一个基于AI Agent的PBL（项目式学习）教学设计工具，通过四阶段交互式流程，帮助教师快速创建专业化的PBL教学方案。

## 核心特性

- 🤖 **AI智能辅助**: 基于Gemini-2.5-Pro的长上下文能力
- 📚 **专业卡片体系**: 集成157张专业PBL卡片（活动卡57张 + 工具卡63张 + 合作卡25张）
- 🎯 **四阶段流程**: 需求调研 → 主题设计 → 教学设计 → 资源匹配
- 📄 **标准化输出**: 符合《长安的荔枝》专业标准的教学方案
- ⚡ **实时交互**: WebSocket支持的流式响应体验

## 技术栈

### 后端
- **Python 3.11** + **FastAPI** - 高性能API服务
- **PostgreSQL** - 主数据库
- **Redis** - 缓存和会话管理
- **SQLAlchemy** - ORM框架
- **Gemini-2.5-Pro** - AI大模型服务

### 前端
- **React 18** + **TypeScript** - 类型安全的组件开发
- **Next.js 14** - 全栈框架
- **Ant Design** - 企业级UI组件
- **Zustand** - 状态管理
- **Socket.io** - 实时通信

## 项目结构

```
亿小步AI Agent训练资料/
├── PRD.md                           # 产品需求文档
├── AI_Agent_技术实现方案.md          # 技术实现方案
├── AI_Agent_PBL_实施计划.md          # 完整实施计划
├── PBL教学活动卡.pdf                # PBL活动卡资源
├── PBL教学工具卡.pdf                # PBL工具卡资源
├── PBL教学合作卡.pdf                # PBL合作卡资源
├── 《长安的荔枝》3-4年级.pdf         # 标准案例参考
└── extracted_texts/                # 提取的文本资源
```

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/liuhuaize/ai-agent-pbl-tool.git
cd ai-agent-pbl-tool
```

### 2. 环境准备
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### 3. 查看实施计划
详细的开发步骤请参考 [AI_Agent_PBL_实施计划.md](./AI_Agent_PBL_实施计划.md)

## 核心功能

### 🎯 四阶段设计流程

1. **需求调研阶段**
   - 动态表单收集教学需求
   - AI分析生成项目主题建议
   - 支持主题个性化定制

2. **主题设计阶段**
   - 人机协作确定核心框架
   - 生成驱动性问题和教学目标
   - 实时预览和调整功能

3. **教学设计阶段**
   - 基于157张专业卡片的智能推荐
   - 活动-工具-合作的最优组合
   - 详细教学步骤自动生成

4. **资源匹配阶段**
   - 智能推荐相关教学资源
   - 生成完整的实施方案
   - 多格式专业化导出

### 🎨 专业化输出

- **完整方案包**: 20-25页专业PDF文档
- **教师指导包**: 实施要点和注意事项
- **学生材料包**: 任务单和工具模板
- **数字化工具**: 可编辑的模板文件

## 开发进度

- [x] 项目规划和需求分析
- [x] 技术方案设计
- [x] 实施计划制定
- [ ] 基础架构搭建
- [ ] AI引擎开发
- [ ] 四阶段流程实现
- [ ] 前端界面开发
- [ ] 导出系统实现
- [ ] 测试和优化
- [ ] 部署上线

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请查看 [LICENSE](LICENSE) 文件

## 联系方式

- 项目维护者: [liuhuaize](https://github.com/liuhuaize)
- 邮箱: [你的邮箱]
- 项目链接: [https://github.com/liuhuaize/ai-agent-pbl-tool](https://github.com/liuhuaize/ai-agent-pbl-tool)

## 致谢

- 感谢PBL教学法的研究者们提供的理论基础
- 感谢《长安的荔枝》案例提供的标准参考
- 感谢所有为项目贡献的开发者和教育工作者

---

**注意**: 这是一个教育AI工具项目，旨在帮助教师提高PBL教学设计效率。请遵守相关的教育和AI使用规范。