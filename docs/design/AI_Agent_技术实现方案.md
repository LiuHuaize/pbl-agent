# AI Agent辅助PBL教学设计工具 - 技术实现方案

## 1. 技术架构概览

### 1.1 整体架构图
```
┌─────────────────────────────────────────────────────────────────┐
│                         前端层 (Frontend)                        │
│  React + TypeScript + Next.js + Ant Design + SWR + Zustand    │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/WebSocket
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                         API网关层 (Gateway)                      │
│              FastAPI + 身份认证 + 请求限流 + 日志                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                         业务逻辑层 (Business)                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   项目管理服务    │  │   Agent核心服务   │  │   资源管理服务    │  │
│  │  ProjectService │  │  AgentService   │  │ ResourceService │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                         AI集成层 (AI Integration)                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Gemini-2.5-Pro  │  │   Prompt管理    │  │   回调处理器     │  │
│  │    API Client   │  │    Templates    │  │   Callbacks     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                         数据层 (Data Layer)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │    Supabase     │  │     Redis       │  │ Supabase Storage │  │
│  │   (持久化数据)   │  │   (缓存/会话)    │  │   (资源文件)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 核心技术栈

**前端技术栈:**
- **React 18 + TypeScript**: 类型安全的组件化开发
- **Next.js 14**: SSR支持和路由管理
- **Ant Design**: 企业级UI组件库
- **SWR**: 数据请求和缓存
- **Zustand**: 轻量级状态管理
- **Socket.io-client**: 实时通信

**后端技术栈:**
- **FastAPI**: 高性能Python Web框架
- **Supabase Python客户端**: 数据库操作和实时功能
- **Redis**: 缓存和会话管理
- **Celery**: 异步任务处理
- **WebSocket**: 实时通信支持

**AI集成:**
- **Google Gemini-2.5-Pro**: 统一的大模型服务
- **LangChain**: Prompt管理和工具集成
- **Pydantic**: 数据验证和序列化

**基础设施:**
- **Supabase**: 主数据库和实时功能
- **Redis**: 缓存和消息队列
- **Docker**: 容器化部署
- **Nginx**: 反向代理和负载均衡
- **Supabase MCP工具**: 数据库管理和操作

## 2. PBL卡片体系集成方案

### 2.1 卡片体系数据库设计

基于对PBL教学卡片的深入分析，我们需要构建完整的卡片知识库：

**活动卡数据库（57张卡片）:**
```python
class ActivityCard(Base):
    __tablename__ = 'activity_cards'
    
    id = Column(String(5), primary_key=True)  # A01-A57
    name = Column(String(100), nullable=False)
    stage = Column(String(20), nullable=False)  # 启发/探究/反思/分享
    description = Column(Text, nullable=False)
    objectives = Column(JSON)  # 学习目标
    duration = Column(String(50))  # 时间要求
    difficulty_level = Column(Integer)  # 难度等级 1-5
    grade_levels = Column(JSON)  # 适用年级 [1,2,3,4,5,6,7,8,9]
    subjects = Column(JSON)  # 适用学科
    recommended_tools = Column(JSON)  # 推荐工具卡编号 [B10, B60, B24]
    recommended_cooperation = Column(JSON)  # 推荐合作卡编号 [C01, C04]
    implementation_tips = Column(Text)  # 实施要点
    resources_needed = Column(JSON)  # 所需资源
```

**工具卡数据库（63张卡片）:**
```python
class ToolCard(Base):
    __tablename__ = 'tool_cards'
    
    id = Column(String(5), primary_key=True)  # B00-B62
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # 基础/设计思维/实践管理
    description = Column(Text, nullable=False)
    template_content = Column(Text)  # 工具模板内容
    usage_guide = Column(Text)  # 使用指南
    compatible_activities = Column(JSON)  # 兼容的活动卡编号
    output_format = Column(String(50))  # 输出格式：表格/图形/文档
    digital_template_path = Column(String(200))  # 数字化模板路径
```

**合作卡数据库（25张卡片）:**
```python
class CooperationCard(Base):
    __tablename__ = 'cooperation_cards'
    
    id = Column(String(5), primary_key=True)  # C01-C25
    name = Column(String(100), nullable=False)
    phase = Column(String(20), nullable=False)  # 组建/过程/评价
    description = Column(Text, nullable=False)
    team_size_range = Column(String(20))  # 适用团队规模 3-6人
    usage_scenario = Column(Text)  # 使用场景
    facilitation_guide = Column(Text)  # 引导指南
```

### 2.2 Gemini-2.5-Pro与卡片体系的集成

**长上下文窗口 (2M tokens):**
- 可以在单个会话中处理完整的四阶段流程和所有卡片信息
- 天然支持复杂的卡片匹配逻辑
- 减少上下文丢失问题

**智能卡片推荐:**
- 基于卡片间的关联关系进行智能推荐
- 考虑时间维度（项目阶段）和功能维度（活动类型）的协调
- 支持个性化的卡片组合优化

**成本效益:**
- 相比GPT-4o更具成本优势
- 单一模型降低集成复杂度
- 减少API调用次数

### 2.3 智能卡片推荐系统

```python
class CardRecommendationSystem:
    def __init__(self):
        self.db = Database()
        self.gemini_client = GeminiClient()
        
    async def recommend_cards(self, stage: str, user_needs: dict, context: dict) -> dict:
        """基于阶段和需求推荐卡片组合"""
        # 1. 获取阶段适配的活动卡
        stage_activities = await self.get_stage_activities(stage)
        
        # 2. 基于用户需求过滤
        filtered_activities = self.filter_by_user_needs(stage_activities, user_needs)
        
        # 3. 使用Gemini进行智能推荐
        recommendations = await self.gemini_recommend(filtered_activities, context)
        
        # 4. 构建完整的卡片组合
        card_combinations = await self.build_card_combinations(recommendations)
        
        return card_combinations
    
    async def get_stage_activities(self, stage: str) -> List[ActivityCard]:
        """获取特定阶段的活动卡"""
        stage_mapping = {
            'requirements': '启发',
            'theme_design': '启发',
            'teaching_design': '探究',
            'resource_matching': '分享'
        }
        
        return await self.db.query(
            ActivityCard
        ).filter(
            ActivityCard.stage == stage_mapping[stage]
        ).all()
    
    async def build_card_combinations(self, activity_cards: List[str]) -> dict:
        """构建完整的卡片组合"""
        combinations = []
        
        for activity_id in activity_cards:
            activity = await self.db.get(ActivityCard, activity_id)
            
            # 获取推荐的工具卡
            tool_cards = await self.get_recommended_tools(activity.recommended_tools)
            
            # 获取推荐的合作卡
            cooperation_cards = await self.get_recommended_cooperation(activity.recommended_cooperation)
            
            combinations.append({
                'activity': activity,
                'tools': tool_cards,
                'cooperation': cooperation_cards,
                'usage_guide': self.generate_usage_guide(activity, tool_cards, cooperation_cards)
            })
        
        return combinations
    
    async def gemini_recommend(self, activities: List[ActivityCard], context: dict) -> List[str]:
        """使用Gemini进行智能推荐"""
        prompt = f"""
        基于以下PBL项目信息和可选活动，推荐最适合的3个活动卡：
        
        项目信息：
        - 年级：{context.get('grade')}
        - 学科：{context.get('subject')}
        - 班级规模：{context.get('class_size')}
        - 教学目标：{context.get('objectives')}
        - 时间安排：{context.get('duration')}
        
        可选活动卡：
        {self.format_activities_for_prompt(activities)}
        
        请考虑：
        1. 活动与教学目标的匹配度
        2. 适合的年级和学科
        3. 时间和资源约束
        4. 学生参与度和实施可行性
        
        返回JSON格式：{{"recommended_activities": ["A01", "A05", "A10"]}}
        """
        
        response = await self.gemini_client.generate_async(prompt)
        return self.parse_recommendations(response)
```

### 2.4 Gemini-2.5-Pro核心架构

```python
class PBLAgentCore:
    def __init__(self):
        self.gemini_client = GeminiClient(api_key=settings.GEMINI_API_KEY)
        self.card_recommender = CardRecommendationSystem()
        self.prompt_manager = PromptManager()
        self.state_manager = StateManager()
        self.context_window = ContextWindow(max_tokens=2000000)
    
    async def process_stage(self, stage: str, user_input: dict) -> dict:
        """处理特定阶段的用户输入"""
        # 1. 获取当前上下文
        context = self.context_window.get_current_context()
        
        # 2. 推荐卡片组合
        card_combinations = await self.card_recommender.recommend_cards(
            stage, user_input, context
        )
        
        # 3. 构建包含卡片信息的Prompt
        prompt = self.prompt_manager.build_stage_prompt(
            stage, user_input, context, card_combinations
        )
        
        # 4. 调用Gemini API
        response = await self.gemini_client.generate_async(
            prompt=prompt,
            temperature=0.7,
            max_tokens=4000,
            stream=True
        )
        
        # 5. 解析和验证响应
        result = self.parse_response(response, card_combinations)
        
        # 6. 更新上下文窗口
        self.context_window.append_interaction(user_input, result)
        
        return result
```

### 2.3 Prompt工程策略

**阶段专用Prompt模板:**
```python
# 需求调研阶段Prompt
REQUIREMENTS_PROMPT = """
你是一个专业的PBL教学设计专家。用户刚刚完成了需求调研表单，请基于以下信息生成项目主题建议。

用户信息：
- 年级：{grade}
- 学科：{subject}
- 班级人数：{class_size}
- 课时安排：{class_hours}
- 教学目标：{teaching_goals}

请生成3个不同的项目主题建议，每个建议包含：
1. 项目名称
2. 一句话描述
3. 核心产出物
4. 建议融合的学科

输出格式：JSON
"""

# 主题设计阶段Prompt
THEME_DESIGN_PROMPT = """
基于用户选择的项目主题，现在需要设计核心框架。

已确定的主题：{selected_theme}
用户需求：{user_requirements}

请生成：
1. 项目概述（100字以内）
2. 核心任务描述
3. 总驱动性问题
4. 教学目标（知识、技能、态度）
5. 评价标准

输出格式：结构化JSON
"""
```

### 2.4 上下文管理机制

```python
class ContextWindow:
    def __init__(self, max_tokens: int = 2000000):
        self.max_tokens = max_tokens
        self.interactions = []
        self.stage_summaries = {}
        self.current_tokens = 0
    
    def append_interaction(self, user_input: dict, ai_response: dict):
        """添加新的交互记录"""
        interaction = {
            'timestamp': datetime.now(),
            'user_input': user_input,
            'ai_response': ai_response,
            'tokens': self.estimate_tokens(user_input, ai_response)
        }
        
        self.interactions.append(interaction)
        self.current_tokens += interaction['tokens']
        
        # 如果超过限制，进行智能压缩
        if self.current_tokens > self.max_tokens * 0.8:
            self.compress_context()
    
    def compress_context(self):
        """智能压缩上下文"""
        # 保留最近的交互
        recent_interactions = self.interactions[-10:]
        
        # 压缩早期交互为摘要
        early_interactions = self.interactions[:-10]
        if early_interactions:
            summary = self.summarize_interactions(early_interactions)
            self.stage_summaries['compressed'] = summary
        
        self.interactions = recent_interactions
        self.recalculate_tokens()
```

## 3. 四阶段Agent实现

### 3.1 整体流程设计

```python
class PBLWorkflow:
    def __init__(self):
        self.stages = [
            RequirementsStage(),
            ThemeDesignStage(),
            TeachingDesignStage(),
            ResourceMatchingStage()
        ]
        self.current_stage = 0
        self.project_state = ProjectState()
    
    async def start_project(self, user_id: str) -> dict:
        """启动新项目"""
        self.project_state.initialize(user_id)
        return await self.stages[0].start()
    
    async def process_user_input(self, user_input: dict) -> dict:
        """处理用户输入"""
        current_stage = self.stages[self.current_stage]
        result = await current_stage.process(user_input)
        
        if result.get('stage_complete'):
            # 生成阶段摘要
            summary = await current_stage.generate_summary()
            self.project_state.add_stage_summary(self.current_stage, summary)
            
            # 进入下一阶段
            if self.current_stage < len(self.stages) - 1:
                self.current_stage += 1
                next_stage = self.stages[self.current_stage]
                return await next_stage.start(self.project_state.get_context())
            else:
                # 所有阶段完成，生成最终方案
                return await self.generate_final_solution()
        
        return result
```

### 3.2 阶段一：需求调研

```python
class RequirementsStage:
    async def start(self) -> dict:
        """启动需求调研阶段"""
        return {
            'stage': 'requirements',
            'action': 'show_form',
            'form_config': self.get_requirements_form_config(),
            'message': '请填写以下信息，帮助我们了解您的教学需求'
        }
    
    async def process(self, user_input: dict) -> dict:
        """处理用户填写的需求表单"""
        # 验证表单数据
        validated_data = self.validate_requirements_form(user_input)
        
        # 调用Gemini生成主题建议
        prompt = self.build_theme_suggestion_prompt(validated_data)
        response = await gemini_client.generate_async(prompt)
        
        # 解析主题建议
        theme_suggestions = self.parse_theme_suggestions(response)
        
        return {
            'stage': 'requirements',
            'action': 'select_theme',
            'theme_suggestions': theme_suggestions,
            'message': '基于您的需求，我为您推荐了以下项目主题'
        }
    
    def get_requirements_form_config(self) -> dict:
        """获取需求表单配置"""
        return {
            'fields': [
                {
                    'name': 'grade',
                    'type': 'select',
                    'label': '年级',
                    'options': ['1-2年级', '3-4年级', '5-6年级', '7-8年级', '9年级']
                },
                {
                    'name': 'subject',
                    'type': 'select',
                    'label': '主要学科',
                    'options': ['语文', '数学', '英语', '科学', '社会']
                },
                {
                    'name': 'class_size',
                    'type': 'number',
                    'label': '班级人数',
                    'min': 10,
                    'max': 50
                },
                {
                    'name': 'duration',
                    'type': 'select',
                    'label': '项目时长',
                    'options': ['1-2周', '3-4周', '1个月', '1个学期']
                },
                {
                    'name': 'teaching_goals',
                    'type': 'textarea',
                    'label': '教学目标',
                    'placeholder': '请描述您希望学生通过这个项目达到的学习目标'
                }
            ]
        }
```

### 3.3 阶段二：主题设计

```python
class ThemeDesignStage:
    async def start(self, context: dict) -> dict:
        """启动主题设计阶段"""
        return {
            'stage': 'theme_design',
            'action': 'confirm_theme',
            'context': context,
            'message': '请确认您选择的项目主题'
        }
    
    async def process(self, user_input: dict) -> dict:
        """处理主题设计"""
        if user_input.get('action') == 'confirm_theme':
            # 生成核心框架
            framework = await self.generate_core_framework(user_input)
            return {
                'stage': 'theme_design',
                'action': 'confirm_framework',
                'framework': framework,
                'message': '请确认项目核心框架'
            }
        
        elif user_input.get('action') == 'confirm_framework':
            # 框架确认完成，准备进入下一阶段
            return {
                'stage': 'theme_design',
                'action': 'stage_complete',
                'stage_complete': True,
                'message': '主题设计阶段完成！'
            }
    
    async def generate_core_framework(self, user_input: dict) -> dict:
        """生成核心框架"""
        prompt = f"""
        基于用户选择的主题和需求，生成PBL项目核心框架。
        
        选择的主题：{user_input.get('selected_theme')}
        用户需求：{user_input.get('requirements')}
        
        请生成：
        1. 项目概述（100字以内）
        2. 核心任务描述
        3. 总驱动性问题
        4. 教学目标（知识、技能、态度维度）
        5. 评价标准
        
        以JSON格式输出，确保内容符合{user_input.get('grade')}学生的认知水平。
        """
        
        response = await gemini_client.generate_async(prompt)
        return self.parse_framework_response(response)
```

### 3.4 阶段三：教学流程设计

```python
class TeachingDesignStage:
    def __init__(self):
        self.teaching_phases = [
            'project_launch',      # 项目启动
            'knowledge_inquiry',   # 知识探究
            'solution_design',     # 方案设计
            'implementation',      # 项目实施
            'presentation'         # 成果展示
        ]
        self.current_phase = 0
    
    async def process(self, user_input: dict) -> dict:
        """处理教学设计"""
        current_phase = self.teaching_phases[self.current_phase]
        
        if user_input.get('action') == 'design_phase':
            # 生成当前阶段的活动建议
            activities = await self.generate_phase_activities(current_phase, user_input)
            return {
                'stage': 'teaching_design',
                'action': 'select_activities',
                'phase': current_phase,
                'activities': activities,
                'message': f'请为{current_phase}阶段选择教学活动'
            }
        
        elif user_input.get('action') == 'confirm_activities':
            # 为选定的活动匹配工具
            tools = await self.match_tools_for_activities(user_input.get('selected_activities'))
            return {
                'stage': 'teaching_design',
                'action': 'select_tools',
                'tools': tools,
                'message': '请选择配套的教学工具'
            }
        
        elif user_input.get('action') == 'confirm_tools':
            # 生成详细的教学步骤
            detailed_steps = await self.generate_detailed_steps(user_input)
            
            # 检查是否还有未设计的阶段
            if self.current_phase < len(self.teaching_phases) - 1:
                self.current_phase += 1
                return {
                    'stage': 'teaching_design',
                    'action': 'design_phase',
                    'message': f'开始设计{self.teaching_phases[self.current_phase]}阶段'
                }
            else:
                return {
                    'stage': 'teaching_design',
                    'action': 'stage_complete',
                    'stage_complete': True,
                    'message': '教学流程设计完成！'
                }
    
    async def generate_phase_activities(self, phase: str, context: dict) -> list:
        """生成阶段活动建议"""
        prompt = f"""
        基于项目主题和当前阶段，推荐适合的教学活动。
        
        项目主题：{context.get('theme')}
        当前阶段：{phase}
        学生年级：{context.get('grade')}
        
        请从教学活动卡库中推荐3个最适合的活动，每个活动包含：
        1. 活动名称
        2. 活动描述
        3. 所需时间
        4. 学习目标
        5. 实施要点
        
        以JSON格式输出。
        """
        
        response = await gemini_client.generate_async(prompt)
        return self.parse_activities_response(response)
    
    async def match_tools_for_activities(self, activities: list) -> list:
        """为活动匹配工具"""
        prompt = f"""
        为以下教学活动匹配最适合的工具卡。
        
        选定的活动：{activities}
        
        请从工具卡库中为每个活动推荐1-2个工具，工具信息包含：
        1. 工具名称
        2. 工具描述
        3. 使用方法
        4. 模板示例
        
        以JSON格式输出。
        """
        
        response = await gemini_client.generate_async(prompt)
        return self.parse_tools_response(response)
```

### 3.5 阶段四：资源匹配与方案生成

```python
class ResourceMatchingStage:
    async def process(self, user_input: dict) -> dict:
        """处理资源匹配"""
        if user_input.get('action') == 'match_resources':
            # 智能推荐教学资源
            resources = await self.intelligent_resource_matching(user_input)
            return {
                'stage': 'resource_matching',
                'action': 'select_resources',
                'resources': resources,
                'message': '请选择需要的教学资源'
            }
        
        elif user_input.get('action') == 'confirm_resources':
            # 生成最终方案
            final_solution = await self.generate_final_solution(user_input)
            return {
                'stage': 'resource_matching',
                'action': 'solution_complete',
                'solution': final_solution,
                'message': '完整的PBL教学方案已生成！'
            }
    
    async def intelligent_resource_matching(self, context: dict) -> dict:
        """智能资源匹配"""
        prompt = f"""
        基于完整的项目设计，智能匹配相关教学资源。
        
        项目信息：
        - 主题：{context.get('theme')}
        - 教学活动：{context.get('activities')}
        - 工具：{context.get('tools')}
        - 年级：{context.get('grade')}
        
        请从以下类别中推荐资源：
        1. 文献资料（书籍、文章、网站）
        2. 音视频资源（纪录片、动画、音频）
        3. 图像资源（图片、图表、地图）
        4. 实验器材（科学器材、材料清单）
        5. 数字工具（软件、应用、在线平台）
        
        每个资源包含：
        - 资源名称
        - 资源描述
        - 使用场景
        - 获取方式
        - 适用年级
        
        以分类的JSON格式输出。
        """
        
        response = await gemini_client.generate_async(prompt)
        return self.parse_resources_response(response)
    
    async def generate_final_solution(self, context: dict) -> dict:
        """生成最终完整方案"""
        prompt = f"""
        基于四个阶段的设计结果，生成完整的PBL教学方案。
        
        整合以下信息：
        - 需求调研结果：{context.get('requirements')}
        - 主题设计：{context.get('theme_design')}
        - 教学流程：{context.get('teaching_design')}
        - 教学资源：{context.get('selected_resources')}
        
        生成完整方案，包含：
        1. 项目概述
        2. 教学目标
        3. 详细教学流程（每个阶段的活动、工具、时间安排）
        4. 评价标准
        5. 教学资源清单
        6. 实施建议
        7. 学生任务单
        
        格式要求：
        - 结构清晰，层次分明
        - 语言简洁，易于理解
        - 包含具体的操作指导
        - 适合{context.get('grade')}学生的认知水平
        
        以结构化的JSON格式输出。
        """
        
        response = await gemini_client.generate_async(prompt)
        return self.parse_final_solution(response)
```

## 4. 数据库设计

### 4.1 核心数据模型

```sql
-- Supabase 数据库表结构设计

-- 用户表（使用 Supabase Auth）
create table public.users (
    id uuid references auth.users(id) on delete cascade,
    username text unique,
    email text unique,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (id)
);

-- 启用 RLS
alter table public.users enable row level security;

-- 项目表
create table public.projects (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.users(id) on delete cascade,
    title text not null,
    description text,
    status text default 'draft' check (status in ('draft', 'in_progress', 'completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- 项目数据 (JSON 格式存储)
    requirements_data jsonb,
    theme_design_data jsonb,
    teaching_design_data jsonb,
    resource_data jsonb,
    final_solution jsonb
);

alter table public.projects enable row level security;

-- 项目交互表
create table public.project_interactions (
    id uuid default gen_random_uuid() primary key,
    project_id uuid references public.projects(id) on delete cascade,
    stage text not null,
    user_input jsonb not null,
    ai_response jsonb not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.project_interactions enable row level security;

-- 教学资源表
create table public.teaching_resources (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    category text not null,
    resource_type text not null,
    resource_url text,
    file_path text,
    metadata jsonb,
    grade_levels jsonb,
    subjects jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 活动卡表
create table public.activity_cards (
    id text primary key, -- A01-A57
    name text not null,
    description text not null,
    category text not null,
    phase text not null,
    duration text,
    objectives jsonb,
    implementation_guide text,
    grade_levels jsonb,
    subjects jsonb
);

-- 工具卡表
create table public.tool_cards (
    id text primary key, -- B00-B62
    name text not null,
    description text not null,
    category text not null,
    usage_guide text,
    template_content text,
    compatible_activities jsonb,
    grade_levels jsonb
);

-- 合作卡表
create table public.cooperation_cards (
    id text primary key, -- C01-C25
    name text not null,
    description text not null,
    phase text not null,
    team_size_range text,
    usage_scenario text,
    facilitation_guide text
);
```

### 4.2 Redis数据结构

```python
# Supabase 客户端配置
from supabase import create_client, Client
import os

class SupabaseClient:
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_ANON_KEY")
        self.supabase: Client = create_client(url, key)
    
    async def create_user_profile(self, user_id: str, user_data: dict):
        """创建用户配置文件"""
        result = self.supabase.table('users').insert({
            'id': user_id,
            'username': user_data.get('username'),
            'email': user_data.get('email')
        }).execute()
        return result
    
    async def create_project(self, project_data: dict):
        """创建项目"""
        result = self.supabase.table('projects').insert(project_data).execute()
        return result
    
    async def get_user_projects(self, user_id: str):
        """获取用户项目"""
        result = self.supabase.table('projects').select('*').eq('user_id', user_id).execute()
        return result
    
    async def update_project(self, project_id: str, updates: dict):
        """更新项目"""
        result = self.supabase.table('projects').update(updates).eq('id', project_id).execute()
        return result
    
    async def get_activity_cards(self, stage: str = None):
        """获取活动卡"""
        query = self.supabase.table('activity_cards').select('*')
        if stage:
            query = query.eq('phase', stage)
        result = query.execute()
        return result
    
    async def get_tool_cards(self, category: str = None):
        """获取工具卡"""
        query = self.supabase.table('tool_cards').select('*')
        if category:
            query = query.eq('category', category)
        result = query.execute()
        return result
    
    async def subscribe_to_project_changes(self, project_id: str, callback):
        """订阅项目变更"""
        self.supabase.table('projects').on('UPDATE', callback).eq('id', project_id).subscribe()

# 会话状态管理（使用 Redis 作为缓存）
class SessionState:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.session_prefix = "pbl_session:"
        self.context_prefix = "pbl_context:"
    
    def save_session_state(self, session_id: str, state: dict):
        """保存会话状态"""
        key = f"{self.session_prefix}{session_id}"
        self.redis.hset(key, mapping=state)
        self.redis.expire(key, 3600)  # 1小时过期
    
    def get_session_state(self, session_id: str) -> dict:
        """获取会话状态"""
        key = f"{self.session_prefix}{session_id}"
        return self.redis.hgetall(key)
    
    def save_context_window(self, session_id: str, context: dict):
        """保存上下文窗口"""
        key = f"{self.context_prefix}{session_id}"
        self.redis.set(key, json.dumps(context))
        self.redis.expire(key, 7200)  # 2小时过期
    
    def get_context_window(self, session_id: str) -> dict:
        """获取上下文窗口"""
        key = f"{self.context_prefix}{session_id}"
        data = self.redis.get(key)
        return json.loads(data) if data else {}
```

## 5. API设计

### 5.1 RESTful API结构

```python
from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import Optional, List

app = FastAPI(title="PBL Agent API", version="1.0.0")

# 数据模型
class ProjectCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None

class RequirementsFormData(BaseModel):
    grade: str
    subject: str
    class_size: int
    duration: str
    teaching_goals: str

class UserInteraction(BaseModel):
    action: str
    data: dict

# API路由
@app.post("/api/v1/projects", response_model=dict)
async def create_project(
    request: ProjectCreateRequest,
    current_user: User = Depends(get_current_user)
):
    """创建新项目"""
    project = Project(
        user_id=current_user.id,
        title=request.title,
        description=request.description
    )
    db.add(project)
    db.commit()
    
    return {"project_id": project.id, "status": "created"}

@app.get("/api/v1/projects/{project_id}", response_model=dict)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user)
):
    """获取项目详情"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project.to_dict()

@app.post("/api/v1/projects/{project_id}/interactions", response_model=dict)
async def process_interaction(
    project_id: int,
    interaction: UserInteraction,
    current_user: User = Depends(get_current_user)
):
    """处理用户交互"""
    # 验证项目归属
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # 处理交互
    agent_service = AgentService()
    result = await agent_service.process_interaction(project_id, interaction)
    
    # 保存交互记录
    interaction_record = ProjectInteraction(
        project_id=project_id,
        stage=result.get('stage'),
        user_input=interaction.dict(),
        ai_response=result
    )
    db.add(interaction_record)
    db.commit()
    
    return result

@app.get("/api/v1/projects/{project_id}/export/{format}", response_class=FileResponse)
async def export_project(
    project_id: int,
    format: str,  # pdf, docx, md
    current_user: User = Depends(get_current_user)
):
    """导出项目方案"""
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    export_service = ExportService()
    file_path = await export_service.export_project(project, format)
    
    return FileResponse(
        file_path,
        media_type='application/octet-stream',
        filename=f"{project.title}.{format}"
    )

# WebSocket端点
@app.websocket("/ws/{project_id}")
async def websocket_endpoint(websocket: WebSocket, project_id: int):
    """WebSocket实时交互"""
    await websocket.accept()
    
    try:
        while True:
            # 接收用户输入
            data = await websocket.receive_json()
            
            # 处理交互
            agent_service = AgentService()
            result = await agent_service.process_interaction_stream(project_id, data)
            
            # 流式返回结果
            async for chunk in result:
                await websocket.send_json(chunk)
                
    except WebSocketDisconnect:
        print(f"Client disconnected from project {project_id}")
```

### 5.2 实时交互支持

```python
class AgentService:
    def __init__(self):
        self.gemini_client = GeminiClient()
        self.workflow_manager = PBLWorkflow()
    
    async def process_interaction_stream(self, project_id: int, user_input: dict):
        """流式处理用户交互"""
        # 获取项目上下文
        context = await self.get_project_context(project_id)
        
        # 构建Prompt
        prompt = self.build_interaction_prompt(context, user_input)
        
        # 流式调用Gemini
        stream_response = await self.gemini_client.generate_stream(prompt)
        
        accumulated_response = ""
        async for chunk in stream_response:
            accumulated_response += chunk
            yield {
                'type': 'stream',
                'content': chunk,
                'accumulated': accumulated_response
            }
        
        # 处理完整响应
        final_result = self.process_complete_response(accumulated_response)
        yield {
            'type': 'complete',
            'result': final_result
        }
```

## 6. 前端实现

### 6.1 主要组件架构

```typescript
// 项目状态管理
import { create } from 'zustand'

interface ProjectState {
  currentProject: Project | null
  currentStage: string
  stageData: Record<string, any>
  isLoading: boolean
  
  // Actions
  setCurrentProject: (project: Project) => void
  updateStageData: (stage: string, data: any) => void
  setLoading: (loading: boolean) => void
}

const useProjectStore = create<ProjectState>((set) => ({
  currentProject: null,
  currentStage: 'requirements',
  stageData: {},
  isLoading: false,
  
  setCurrentProject: (project) => set({ currentProject: project }),
  updateStageData: (stage, data) => set((state) => ({
    stageData: { ...state.stageData, [stage]: data }
  })),
  setLoading: (loading) => set({ isLoading: loading })
}))

// 主要页面组件
const ProjectDesignPage: React.FC = () => {
  const { currentProject, currentStage, stageData, isLoading } = useProjectStore()
  const [ws, setWs] = useState<WebSocket | null>(null)
  
  useEffect(() => {
    if (currentProject) {
      // 建立WebSocket连接
      const websocket = new WebSocket(`ws://localhost:8000/ws/${currentProject.id}`)
      setWs(websocket)
      
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleAgentResponse(data)
      }
      
      return () => websocket.close()
    }
  }, [currentProject])
  
  const handleUserInteraction = (interaction: UserInteraction) => {
    if (ws) {
      ws.send(JSON.stringify(interaction))
    }
  }
  
  const handleAgentResponse = (response: any) => {
    if (response.type === 'stream') {
      // 处理流式响应
      updateStreamContent(response.content)
    } else if (response.type === 'complete') {
      // 处理完整响应
      processCompleteResponse(response.result)
    }
  }
  
  return (
    <div className="project-design-container">
      <div className="layout-container">
        {/* 左侧进度导航 */}
        <div className="progress-sidebar">
          <StageNavigation currentStage={currentStage} />
        </div>
        
        {/* 中间交互区域 */}
        <div className="interaction-area">
          {currentStage === 'requirements' && (
            <RequirementsStage onInteraction={handleUserInteraction} />
          )}
          {currentStage === 'theme_design' && (
            <ThemeDesignStage onInteraction={handleUserInteraction} />
          )}
          {currentStage === 'teaching_design' && (
            <TeachingDesignStage onInteraction={handleUserInteraction} />
          )}
          {currentStage === 'resource_matching' && (
            <ResourceMatchingStage onInteraction={handleUserInteraction} />
          )}
        </div>
        
        {/* 右侧预览区域 */}
        <div className="preview-sidebar">
          <ProjectPreview stageData={stageData} />
        </div>
      </div>
    </div>
  )
}

// 需求调研阶段组件
const RequirementsStage: React.FC<{onInteraction: (interaction: UserInteraction) => void}> = ({ onInteraction }) => {
  const [formData, setFormData] = useState<RequirementsFormData>({
    grade: '',
    subject: '',
    class_size: 30,
    duration: '',
    teaching_goals: ''
  })
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onInteraction({
      action: 'submit_requirements',
      data: formData
    })
  }
  
  return (
    <div className="requirements-stage">
      <h2>项目需求调研</h2>
      <Form onFinish={handleSubmit}>
        <Form.Item label="年级" name="grade">
          <Select
            value={formData.grade}
            onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
            options={[
              { value: '1-2年级', label: '1-2年级' },
              { value: '3-4年级', label: '3-4年级' },
              { value: '5-6年级', label: '5-6年级' },
              { value: '7-8年级', label: '7-8年级' },
              { value: '9年级', label: '9年级' }
            ]}
          />
        </Form.Item>
        
        <Form.Item label="主要学科" name="subject">
          <Select
            value={formData.subject}
            onChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
            options={[
              { value: '语文', label: '语文' },
              { value: '数学', label: '数学' },
              { value: '英语', label: '英语' },
              { value: '科学', label: '科学' },
              { value: '社会', label: '社会' }
            ]}
          />
        </Form.Item>
        
        <Form.Item label="班级人数" name="class_size">
          <InputNumber
            min={10}
            max={50}
            value={formData.class_size}
            onChange={(value) => setFormData(prev => ({ ...prev, class_size: value || 30 }))}
          />
        </Form.Item>
        
        <Form.Item label="项目时长" name="duration">
          <Select
            value={formData.duration}
            onChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
            options={[
              { value: '1-2周', label: '1-2周' },
              { value: '3-4周', label: '3-4周' },
              { value: '1个月', label: '1个月' },
              { value: '1个学期', label: '1个学期' }
            ]}
          />
        </Form.Item>
        
        <Form.Item label="教学目标" name="teaching_goals">
          <Input.TextArea
            rows={4}
            value={formData.teaching_goals}
            onChange={(e) => setFormData(prev => ({ ...prev, teaching_goals: e.target.value }))}
            placeholder="请描述您希望学生通过这个项目达到的学习目标"
          />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" size="large">
            提交需求
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
```

### 6.2 实时交互组件

```typescript
// 流式响应处理组件
const StreamingResponse: React.FC<{content: string}> = ({ content }) => {
  const [displayContent, setDisplayContent] = useState('')
  
  useEffect(() => {
    // 打字机效果
    let index = 0
    const interval = setInterval(() => {
      if (index < content.length) {
        setDisplayContent(content.substring(0, index + 1))
        index++
      } else {
        clearInterval(interval)
      }
    }, 50)
    
    return () => clearInterval(interval)
  }, [content])
  
  return (
    <div className="streaming-response">
      <ReactMarkdown>{displayContent}</ReactMarkdown>
    </div>
  )
}

// 主题选择组件
const ThemeSelection: React.FC<{themes: Theme[], onSelect: (theme: Theme) => void}> = ({ themes, onSelect }) => {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)
  
  return (
    <div className="theme-selection">
      <h3>请选择项目主题</h3>
      <div className="theme-cards">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            hoverable
            className={selectedTheme?.id === theme.id ? 'selected' : ''}
            onClick={() => setSelectedTheme(theme)}
          >
            <Card.Meta
              title={theme.name}
              description={theme.description}
            />
            <div className="theme-details">
              <p><strong>核心产出物:</strong> {theme.deliverables}</p>
              <p><strong>融合学科:</strong> {theme.integrated_subjects.join(', ')}</p>
            </div>
          </Card>
        ))}
      </div>
      
      {selectedTheme && (
        <div className="confirmation-section">
          <Button 
            type="primary" 
            size="large"
            onClick={() => onSelect(selectedTheme)}
          >
            确认选择此主题
          </Button>
        </div>
      )}
    </div>
  )
}
```

## 7. 专业化方案导出功能

### 7.1 基于《长安的荔枝》标准的导出服务

```python
from weasyprint import HTML, CSS
from jinja2 import Template
from docx import Document
from docx.shared import Inches
import os
import json

class ProfessionalExportService:
    def __init__(self):
        self.template_dir = "templates/pbl_export"
        self.output_dir = "exports"
        self.card_service = CardService()
        
    async def export_project(self, project: Project, format: str) -> dict:
        """导出专业化PBL项目方案"""
        if format == 'complete_package':
            return await self.export_complete_package(project)
        elif format == 'teacher_guide':
            return await self.export_teacher_guide(project)
        elif format == 'student_materials':
            return await self.export_student_materials(project)
        elif format == 'template_collection':
            return await self.export_template_collection(project)
        else:
            raise ValueError(f"Unsupported format: {format}")
    
    async def export_complete_package(self, project: Project) -> dict:
        """导出完整方案包（类似《长安的荔枝》格式）"""
        # 1. 准备完整的项目数据
        context = await self.prepare_complete_context(project)
        
        # 2. 生成各个组件
        components = {
            'requirements_form': await self.generate_requirements_form(context),
            'project_overview': await self.generate_project_overview(context),
            'stage_activities': await self.generate_stage_activities(context),
            'tool_templates': await self.generate_tool_templates(context),
            'cooperation_guides': await self.generate_cooperation_guides(context),
            'evaluation_rubrics': await self.generate_evaluation_rubrics(context),
            'resource_list': await self.generate_resource_list(context),
            'implementation_guide': await self.generate_implementation_guide(context)
        }
        
        # 3. 组装完整PDF
        pdf_path = await self.assemble_complete_pdf(components, project)
        
        return {
            'main_document': pdf_path,
            'components': components,
            'total_pages': self.calculate_total_pages(components)
        }
    
    async def prepare_complete_context(self, project: Project) -> dict:
        """准备完整的导出上下文数据"""
        # 获取项目中使用的所有卡片
        used_cards = await self.get_used_cards(project)
        
        # 生成卡片对照表
        card_mapping = await self.generate_card_mapping(used_cards)
        
        return {
            'project_title': project.title,
            'project_description': project.description,
            'requirements': project.requirements_data,
            'theme_design': project.theme_design_data,
            'teaching_design': project.teaching_design_data,
            'resources': project.resource_data,
            'final_solution': project.final_solution,
            'used_cards': used_cards,
            'card_mapping': card_mapping,
            'created_at': project.created_at.strftime('%Y-%m-%d'),
            'export_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    
    async def generate_stage_activities(self, context: dict) -> dict:
        """生成阶段活动详细设计"""
        stages = []
        
        for stage_data in context['teaching_design']['stages']:
            stage_activities = []
            
            for activity_data in stage_data['activities']:
                # 获取活动卡详细信息
                activity_card = await self.card_service.get_activity_card(activity_data['card_id'])
                
                # 获取配套工具卡
                tool_cards = await self.card_service.get_tool_cards(activity_data['tool_ids'])
                
                # 获取合作卡
                cooperation_cards = await self.card_service.get_cooperation_cards(activity_data['cooperation_ids'])
                
                # 生成活动-工具-合作对照表
                activity_detail = {
                    'activity': activity_card,
                    'tools': tool_cards,
                    'cooperation': cooperation_cards,
                    'teaching_steps': activity_data['teaching_steps'],
                    'time_allocation': activity_data['time_allocation'],
                    'materials_needed': activity_data['materials_needed'],
                    'expected_outcomes': activity_data['expected_outcomes']
                }
                
                stage_activities.append(activity_detail)
            
            stages.append({
                'stage_name': stage_data['name'],
                'stage_objectives': stage_data['objectives'],
                'driving_questions': stage_data['driving_questions'],
                'activities': stage_activities,
                'assessment_methods': stage_data['assessment_methods']
            })
        
        return {'stages': stages}
    
    async def generate_tool_templates(self, context: dict) -> dict:
        """生成工具模板集合"""
        templates = []
        
        for card_id in context['used_cards']['tools']:
            tool_card = await self.card_service.get_tool_card(card_id)
            
            # 生成模板内容
            template_content = await self.render_tool_template(tool_card, context)
            
            templates.append({
                'card_id': card_id,
                'card_name': tool_card.name,
                'template_content': template_content,
                'usage_instructions': tool_card.usage_guide,
                'example_filled': await self.generate_example_filled_template(tool_card, context)
            })
        
        return {'templates': templates}
    
    async def render_tool_template(self, tool_card: ToolCard, context: dict) -> str:
        """渲染工具模板"""
        template_path = os.path.join(self.template_dir, 'tools', f'{tool_card.id}.html')
        
        if os.path.exists(template_path):
            with open(template_path, 'r', encoding='utf-8') as f:
                template = Template(f.read())
            return template.render(
                project_title=context['project_title'],
                grade=context['requirements']['grade'],
                subject=context['requirements']['subject'],
                **context
            )
        else:
            # 使用通用模板
            return await self.generate_generic_template(tool_card, context)
    
    async def assemble_complete_pdf(self, components: dict, project: Project) -> str:
        """组装完整的PDF文档"""
        # 1. 创建主HTML文档
        main_html = await self.create_main_html_document(components, project)
        
        # 2. 加载CSS样式
        css_content = await self.load_pbl_css_styles()
        
        # 3. 生成PDF
        pdf_path = os.path.join(self.output_dir, f"PBL_{project.title}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf")
        
        HTML(string=main_html).write_pdf(
            pdf_path,
            stylesheets=[CSS(string=css_content)],
            presentational_hints=True
        )
        
        return pdf_path
    
    async def create_main_html_document(self, components: dict, project: Project) -> str:
        """创建主HTML文档"""
        template_path = os.path.join(self.template_dir, 'main_document.html')
        
        with open(template_path, 'r', encoding='utf-8') as f:
            template = Template(f.read())
        
        return template.render(
            project_title=project.title,
            components=components,
            table_of_contents=self.generate_table_of_contents(components),
            **components
        )
    
    def generate_table_of_contents(self, components: dict) -> list:
        """生成目录"""
        toc = [
            {"title": "一、项目概述", "page": 1},
            {"title": "二、需求调研表", "page": 2},
            {"title": "三、项目主题设计", "page": 4},
            {"title": "四、教学流程设计", "page": 6},
            {"title": "五、工具模板集合", "page": 12},
            {"title": "六、合作指导卡", "page": 18},
            {"title": "七、评价量规", "page": 20},
            {"title": "八、教学资源清单", "page": 22},
            {"title": "九、实施指导建议", "page": 24}
        ]
        return toc
```

### 7.2 HTML模板设计

```html
<!-- templates/export/project_template.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ project_title }} - PBL教学方案</title>
    <style>
        body {
            font-family: "Microsoft YaHei", "SimHei", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section-title {
            color: #007bff;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-left: 4px solid #007bff;
            padding-left: 15px;
        }
        .activity-card {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .tool-item {
            background: #e7f3ff;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin-bottom: 15px;
        }
        .resource-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .resource-item {
            background: #f0f8ff;
            border: 1px solid #cce7ff;
            border-radius: 6px;
            padding: 15px;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ project_title }}</h1>
        <p>PBL项目式学习教学方案</p>
        <p>生成日期: {{ export_date }}</p>
    </div>
    
    <div class="section">
        <h2 class="section-title">项目概述</h2>
        <p>{{ final_solution.project_overview }}</p>
        
        <div class="project-info">
            <p><strong>适用年级:</strong> {{ requirements.grade }}</p>
            <p><strong>主要学科:</strong> {{ requirements.subject }}</p>
            <p><strong>项目时长:</strong> {{ requirements.duration }}</p>
            <p><strong>班级人数:</strong> {{ requirements.class_size }}人</p>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">教学目标</h2>
        <div class="objectives">
            {% for category, objectives in final_solution.teaching_objectives.items() %}
            <h4>{{ category }}目标:</h4>
            <ul>
                {% for objective in objectives %}
                <li>{{ objective }}</li>
                {% endfor %}
            </ul>
            {% endfor %}
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">核心任务与驱动性问题</h2>
        <div class="core-task">
            <h4>核心任务:</h4>
            <p>{{ theme_design.core_task }}</p>
        </div>
        <div class="driving-question">
            <h4>驱动性问题:</h4>
            <p>{{ theme_design.driving_question }}</p>
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">详细教学流程</h2>
        {% for phase in teaching_design.phases %}
        <div class="phase">
            <h3>{{ phase.name }}</h3>
            <p><strong>时间安排:</strong> {{ phase.duration }}</p>
            <p><strong>学习目标:</strong> {{ phase.objectives }}</p>
            
            <h4>教学活动:</h4>
            {% for activity in phase.activities %}
            <div class="activity-card">
                <h5>{{ activity.name }}</h5>
                <p>{{ activity.description }}</p>
                <p><strong>实施要点:</strong> {{ activity.implementation_guide }}</p>
                
                <h6>配套工具:</h6>
                {% for tool in activity.tools %}
                <div class="tool-item">
                    <h6>{{ tool.name }}</h6>
                    <p>{{ tool.description }}</p>
                    <p><strong>使用方法:</strong> {{ tool.usage_guide }}</p>
                </div>
                {% endfor %}
            </div>
            {% endfor %}
        </div>
        {% endfor %}
    </div>
    
    <div class="section">
        <h2 class="section-title">评价标准</h2>
        <div class="evaluation-criteria">
            {% for criterion in final_solution.evaluation_criteria %}
            <div class="criterion">
                <h4>{{ criterion.name }}</h4>
                <p>{{ criterion.description }}</p>
                <ul>
                    {% for level in criterion.levels %}
                    <li><strong>{{ level.name }}:</strong> {{ level.description }}</li>
                    {% endfor %}
                </ul>
            </div>
            {% endfor %}
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">教学资源清单</h2>
        <div class="resource-list">
            {% for category, resources in resource_data.items() %}
            <div class="resource-category">
                <h4>{{ category }}</h4>
                {% for resource in resources %}
                <div class="resource-item">
                    <h5>{{ resource.title }}</h5>
                    <p>{{ resource.description }}</p>
                    <p><strong>获取方式:</strong> {{ resource.access_method }}</p>
                </div>
                {% endfor %}
            </div>
            {% endfor %}
        </div>
    </div>
    
    <div class="section">
        <h2 class="section-title">实施建议</h2>
        <div class="implementation-tips">
            {% for tip in final_solution.implementation_tips %}
            <div class="tip">
                <h4>{{ tip.title }}</h4>
                <p>{{ tip.content }}</p>
            </div>
            {% endfor %}
        </div>
    </div>
    
    <div class="footer">
        <p>本方案由AI Agent辅助PBL教学设计工具生成</p>
        <p>生成时间: {{ export_date }}</p>
    </div>
</body>
</html>
```

## 8. 部署与运维

### 8.1 Docker容器化

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - redis
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
      - REDIS_URL=redis://redis:6379
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./exports:/app/exports
      - ./templates:/app/templates
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - app
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
```

### 8.2 监控与日志

```python
# 性能监控
from prometheus_client import Counter, Histogram, generate_latest
import time

# 指标定义
REQUEST_COUNT = Counter('pbl_agent_requests_total', 'Total requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('pbl_agent_request_duration_seconds', 'Request duration')
AI_GENERATION_COUNT = Counter('pbl_agent_ai_generations_total', 'Total AI generations', ['stage'])
AI_GENERATION_DURATION = Histogram('pbl_agent_ai_generation_duration_seconds', 'AI generation duration')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
    REQUEST_DURATION.observe(duration)
    
    return response

# 日志配置
import logging
from logging.handlers import RotatingFileHandler

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            RotatingFileHandler('logs/pbl_agent.log', maxBytes=10*1024*1024, backupCount=5),
            logging.StreamHandler()
        ]
    )
    
    # 设置各模块日志级别
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
    logging.getLogger('uvicorn.access').setLevel(logging.WARNING)
```

## 9. 卡片匹配逻辑详解

### 9.1 三类卡片的智能匹配机制

基于对PBL卡片体系的深入分析，我们实现了以下匹配逻辑：

**阶段匹配机制:**
```python
class CardMatchingEngine:
    def __init__(self):
        self.stage_mapping = {
            'requirements': ['启发'],
            'theme_design': ['启发'],
            'teaching_design': ['探究', '实施'],
            'resource_matching': ['反思', '分享']
        }
        
    async def match_cards_by_stage(self, stage: str, user_context: dict) -> dict:
        """基于阶段匹配卡片"""
        applicable_stages = self.stage_mapping[stage]
        
        # 1. 获取适用阶段的活动卡
        activities = await self.get_activities_by_stages(applicable_stages)
        
        # 2. 根据用户上下文过滤
        filtered_activities = self.filter_by_context(activities, user_context)
        
        # 3. 为每个活动匹配工具卡和合作卡
        matched_combinations = []
        for activity in filtered_activities:
            combination = {
                'activity': activity,
                'tools': await self.match_tools_for_activity(activity),
                'cooperation': await self.match_cooperation_for_activity(activity),
                'rationale': self.generate_matching_rationale(activity, user_context)
            }
            matched_combinations.append(combination)
        
        return matched_combinations
```

**基于编号的关联匹配:**
```python
def get_card_relationships(self):
    """定义卡片间的关联关系"""
    return {
        # 启发阶段常用组合
        'inspiration_combinations': [
            {'activity': 'A01', 'tools': ['B10', 'B60'], 'cooperation': ['C01', 'C04']},
            {'activity': 'A03', 'tools': ['B10', 'B24'], 'cooperation': ['C01', 'C04']},
            {'activity': 'A05', 'tools': ['B24', 'B43'], 'cooperation': ['C01', 'C04']},
        ],
        
        # 探究阶段常用组合
        'inquiry_combinations': [
            {'activity': 'A14', 'tools': ['B21', 'B32'], 'cooperation': ['C03', 'C15']},
            {'activity': 'A15', 'tools': ['B21', 'B32'], 'cooperation': ['C03', 'C15']},
            {'activity': 'A21', 'tools': ['B43', 'B21'], 'cooperation': ['C03', 'C15']},
        ],
        
        # 实施阶段常用组合
        'implementation_combinations': [
            {'activity': 'A26', 'tools': ['B20', 'B29'], 'cooperation': ['C03', 'C05']},
            {'activity': 'A27', 'tools': ['B28', 'B07'], 'cooperation': ['C05', 'C13']},
            {'activity': 'A28', 'tools': ['B45', 'B48'], 'cooperation': ['C03', 'C12']},
        ],
        
        # 分享阶段常用组合
        'sharing_combinations': [
            {'activity': 'A46', 'tools': ['B13', 'B15'], 'cooperation': ['C19', 'C18']},
            {'activity': 'A50', 'tools': ['B13', 'B16'], 'cooperation': ['C19', 'C25']},
            {'activity': 'A52', 'tools': ['B13', 'B17'], 'cooperation': ['C18', 'C25']},
        ]
    }
```

### 9.2 AI Agent卡片选择的决策树

```python
class CardSelectionDecisionTree:
    async def select_optimal_cards(self, user_input: dict, stage: str, context: dict) -> dict:
        """使用决策树选择最优卡片组合"""
        
        # 1. 基础筛选
        base_filter = {
            'grade_level': user_input.get('grade'),
            'subject': user_input.get('subject'),
            'class_size': user_input.get('class_size'),
            'stage': stage
        }
        
        # 2. 情境匹配
        scenario_factors = {
            'teaching_experience': context.get('teacher_experience'),
            'available_time': context.get('time_constraints'),
            'resources': context.get('available_resources'),
            'student_characteristics': context.get('student_profile')
        }
        
        # 3. 使用Gemini进行智能决策
        decision_prompt = self.build_decision_prompt(base_filter, scenario_factors)
        
        gemini_response = await self.gemini_client.generate_async(decision_prompt)
        
        # 4. 解析和验证推荐结果
        recommended_cards = self.parse_card_recommendations(gemini_response)
        
        # 5. 验证卡片组合的可行性
        validated_combinations = await self.validate_card_combinations(recommended_cards)
        
        return validated_combinations
```

### 9.3 专业化输出格式

**基于《长安的荔枝》标准的输出结构:**
```python
def generate_professional_output_structure(self, project_data: dict) -> dict:
    """生成专业化的输出结构"""
    return {
        'part_one': {
            'title': 'PBL项目设计需求调研表',
            'content': self.generate_requirements_form(project_data),
            'pages': [1, 2]
        },
        'part_two': {
            'title': '项目主题与核心任务设计',
            'content': self.generate_theme_design(project_data),
            'pages': [3, 4]
        },
        'part_three': {
            'title': '各阶段项目活动设计',
            'sections': [
                {
                    'title': '启动引入阶段',
                    'content': self.generate_stage_content('启动引入', project_data),
                    'activity_tool_mapping': self.generate_activity_tool_mapping('启动引入'),
                    'pages': [5, 6]
                },
                {
                    'title': '知识探究阶段',
                    'content': self.generate_stage_content('知识探究', project_data),
                    'activity_tool_mapping': self.generate_activity_tool_mapping('知识探究'),
                    'pages': [7, 8, 9]
                },
                {
                    'title': '方案设计阶段',
                    'content': self.generate_stage_content('方案设计', project_data),
                    'activity_tool_mapping': self.generate_activity_tool_mapping('方案设计'),
                    'pages': [10, 11]
                },
                {
                    'title': '项目实施阶段',
                    'content': self.generate_stage_content('项目实施', project_data),
                    'activity_tool_mapping': self.generate_activity_tool_mapping('项目实施'),
                    'pages': [12, 13]
                },
                {
                    'title': '成果展示阶段',
                    'content': self.generate_stage_content('成果展示', project_data),
                    'activity_tool_mapping': self.generate_activity_tool_mapping('成果展示'),
                    'pages': [14, 15]
                }
            ]
        },
        'part_four': {
            'title': '项目各阶段工具模板',
            'content': self.generate_tool_templates(project_data),
            'pages': [16, 17, 18, 19, 20]
        },
        'part_five': {
            'title': '教学资源建议',
            'content': self.generate_resource_recommendations(project_data),
            'pages': [21, 22]
        }
    }
```

## 10. Supabase MCP工具集成

### 10.1 MCP工具使用说明

在这个项目中，我们使用以下 Supabase MCP 工具来管理数据库操作：

```python
class SupabaseMCPIntegration:
    def __init__(self, project_id: str):
        self.project_id = project_id
    
    async def initialize_database(self):
        """初始化数据库表结构"""
        # 创建用户表
        await self.create_table_if_not_exists('users')
        
        # 创建项目表
        await self.create_table_if_not_exists('projects')
        
        # 创建卡片表
        await self.create_table_if_not_exists('activity_cards')
        await self.create_table_if_not_exists('tool_cards')
        await self.create_table_if_not_exists('cooperation_cards')
    
    async def create_table_if_not_exists(self, table_name: str):
        """检查并创建表"""
        # 使用 mcp__supabase__list_tables 检查表是否存在
        tables = await self.list_tables()
        
        if table_name not in [t['name'] for t in tables]:
            # 使用 mcp__supabase__apply_migration 创建表
            await self.apply_migration(table_name)
    
    async def insert_card_data(self, card_type: str, card_data: dict):
        """插入卡片数据"""
        table_name = f"{card_type}_cards"
        
        # 使用 mcp__supabase__execute_sql 插入数据
        sql = f"""
        INSERT INTO {table_name} (id, name, description, category, phase)
        VALUES (%(id)s, %(name)s, %(description)s, %(category)s, %(phase)s)
        ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        category = EXCLUDED.category,
        phase = EXCLUDED.phase
        """
        
        await self.execute_sql(sql, card_data)
    
    async def get_project_data(self, project_id: str):
        """获取项目数据"""
        sql = "SELECT * FROM projects WHERE id = %s"
        return await self.execute_sql(sql, [project_id])
    
    async def update_project_stage(self, project_id: str, stage: str, data: dict):
        """更新项目阶段数据"""
        sql = f"""
        UPDATE projects 
        SET {stage}_data = %s, updated_at = NOW()
        WHERE id = %s
        """
        await self.execute_sql(sql, [data, project_id])
    
    async def generate_typescript_types(self):
        """生成 TypeScript 类型定义"""
        # 使用 mcp__supabase__generate_typescript_types
        return await self.generate_types()
    
    async def setup_row_level_security(self):
        """设置行级安全策略"""
        # 用户只能访问自己的项目
        rls_policy = """
        CREATE POLICY "Users can only access their own projects" ON projects
        FOR ALL USING (auth.uid() = user_id);
        """
        await self.execute_sql(rls_policy)
        
        # 用户只能访问自己的交互记录
        interaction_policy = """
        CREATE POLICY "Users can only access their own interactions" ON project_interactions
        FOR ALL USING (auth.uid() = (SELECT user_id FROM projects WHERE id = project_id));
        """
        await self.execute_sql(interaction_policy)
```

### 10.2 开发流程优化

使用 Supabase MCP 工具后，开发流程将大幅优化：

1. **无需本地数据库**: 不再需要在本地安装和配置 PostgreSQL
2. **自动类型生成**: 使用 `mcp__supabase__generate_typescript_types` 自动生成前端类型
3. **实时功能**: 利用 Supabase 内置的实时订阅功能
4. **一键部署**: 只需要配置 Supabase 项目参数即可部署

### 10.3 环境变量配置

```bash
# .env 文件
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
GEMINI_API_KEY=your-gemini-key
REDIS_URL=redis://localhost:6379
```

### 10.4 数据库初始化脚本

```python
# scripts/init_database.py
import asyncio
from supabase_mcp_integration import SupabaseMCPIntegration

async def main():
    # 初始化数据库
    mcp = SupabaseMCPIntegration("your-project-id")
    await mcp.initialize_database()
    
    # 导入卡片数据
    await mcp.import_pbl_cards()
    
    # 设置安全策略
    await mcp.setup_row_level_security()
    
    print("数据库初始化完成！")

if __name__ == "__main__":
    asyncio.run(main())
```

## 11. 总结

这个技术方案实现了一个完整的AI Agent辅助PBL教学设计工具，具有以下特点：

### 11.1 核心优势
- **专业化卡片体系**: 基于157张专业PBL卡片的完整知识库
- **智能匹配算法**: 活动卡、工具卡、合作卡的智能组合推荐
- **长上下文支持**: 充分利用Gemini-2.5-Pro的2M token窗口
- **标准化输出**: 完全符合《长安的荔枝》专业标准的方案格式
- **实时交互**: WebSocket + 流式输出提供流畅的用户体验
- **Supabase集成**: 更快的开发速度和更简单的部署

### 11.2 技术亮点
- **卡片关系建模**: 完整的卡片间关联关系和匹配逻辑
- **决策树算法**: 基于多维度因素的智能卡片选择
- **模块化架构**: 前后端分离，各模块职责清晰
- **专业化模板**: 基于真实PBL案例的输出模板系统
- **MCP工具集成**: 使用Supabase MCP工具简化数据库操作
- **监控运维**: 完善的日志和监控体系

### 11.3 可扩展性
- **卡片库扩展**: 活动卡、工具卡、合作卡可通过配置动态扩展
- **多模型支持**: 架构支持未来接入其他AI模型
- **多租户**: 支持企业级多租户部署
- **国际化**: 前端支持多语言扩展
- **实时协作**: 利用Supabase的实时功能实现多用户协作

### 11.4 Supabase集成带来的额外优势
- **无需本地数据库设置**: 开发环境搭建更快
- **内置认证系统**: 使用Supabase Auth简化用户管理
- **实时数据同步**: 内置实时订阅功能
- **自动备份和恢复**: Supabase的云服务保证数据安全
- **类型安全**: 自动生成TypeScript类型定义
- **成本优化**: 减少服务器资源消耗和维护成本

这个方案在保证功能完整性的同时，充分考虑了PBL教学的专业性要求、开发效率、运维成本和用户体验，是一个实用且可持续发展的技术架构。通过使用Supabase和MCP工具，这个方案在简化开发流程的同时，也提供了更强的扩展性和维护性。

<function_calls>
<invoke name="TodoWrite">
<parameter name="todos">[{"id": "1", "content": "\u5206\u6790PRD\u6587\u6863\uff0c\u7406\u89e3AI Agent\u7684\u6838\u5fc3\u529f\u80fd\u548c\u4e1a\u52a1\u903b\u8f91", "status": "completed", "priority": "high"}, {"id": "2", "content": "\u548c\u7528\u6237\u8ba8\u8bbaAI Agent\u7684\u5b9e\u73b0\u6a21\u5f0f\u548c\u67b6\u6784\u8bbe\u8ba1", "status": "completed", "priority": "high"}, {"id": "3", "content": "\u548c\u7528\u6237\u8ba8\u8bba\u6280\u672f\u6808\u9009\u62e9\u548c\u6743\u8861", "status": "completed", "priority": "high"}, {"id": "4", "content": "\u7f16\u5199\u6700\u7ec8\u7684\u6280\u672f\u5b9e\u73b0\u6587\u6863", "status": "completed", "priority": "medium"}]