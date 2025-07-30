import google.generativeai as genai
from typing import Dict, Any, List, Optional, AsyncGenerator
import asyncio
import json
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class GeminiClient:
    """Gemini API客户端封装"""
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self.max_tokens = settings.MAX_TOKENS
        self.temperature = settings.TEMPERATURE
        self.model = None
        self._initialize_client()
    
    def _initialize_client(self):
        """  初始化Gemini客户端 """
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
            logger.info(f"Gemini客户端初始化成功: {self.model_name}")
        except Exception as e:
            logger.error(f"Gemini客户端初始化失败: {e}")
            raise
    
    async def generate_async(self, prompt: str, **kwargs) -> str:
        """  异步生成内容 """
        try:
            generation_config = {
                "temperature": kwargs.get("temperature", self.temperature),
                "max_output_tokens": kwargs.get("max_tokens", self.max_tokens),
                "top_p": kwargs.get("top_p", 0.95),
                "top_k": kwargs.get("top_k", 64),
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=generation_config,
                safety_settings=safety_settings
            )
            
            return response.text
            
        except Exception as e:
            logger.error(f"Gemini内容生成失败: {e}")
            raise
    
    async def generate_stream(self, prompt: str, **kwargs) -> AsyncGenerator[str, None]:
        """  流式生成内容 """
        try:
            generation_config = {
                "temperature": kwargs.get("temperature", self.temperature),
                "max_output_tokens": kwargs.get("max_tokens", self.max_tokens),
                "top_p": kwargs.get("top_p", 0.95),
                "top_k": kwargs.get("top_k", 64),
            }
            
            safety_settings = [
                {
                    "category": "HARM_CATEGORY_HARASSMENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_HATE_SPEECH",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                }
            ]
            
            response = await asyncio.to_thread(
                self.model.generate_content,
                prompt,
                generation_config=generation_config,
                safety_settings=safety_settings,
                stream=True
            )
            
            for chunk in response:
                if chunk.text:
                    yield chunk.text
                    
        except Exception as e:
            logger.error(f"Gemini流式生成失败: {e}")
            raise
    
    async def analyze_requirements(self, requirements: Dict[str, Any]) -> Dict[str, Any]:
        """  分析用户需求并生成主题建议 """
        prompt = f"""
        作为一个专业PBL教学设计专家，请基于以下用户需求生成项目主题建议。
        
        用户需求信息：
        - 年级：{requirements.get('grade', '')}
        - 学科：{requirements.get('subject', '')}
        - 班级人数：{requirements.get('class_size', '')}
        - 项目时长：{requirements.get('duration', '')}
        - 教学目标：{requirements.get('teaching_goals', '')}
        
        请生成三个不同的项目主题建议，每个建议包含：
        1. 项目名称
        2. 一句话描述
        3. 核心产出物
        4. 建议融合的学科
        5. 估计难度等级（1-5级）
        
        请以JSON格式返回结果。
        """
        
        try:
            response_text = await self.generate_async(prompt)
            # 尝试解析JSON响应
            try:
                response_data = json.loads(response_text)
                return response_data
            except json.JSONDecodeError:
                # 如果解析失败，返回原始文本
                return {"raw_response": response_text}
        except Exception as e:
            logger.error(f"需求分析失败: {e}")
            raise
    
    async def generate_theme_framework(self, theme_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """  生成主题框架 """
        prompt = f"""
        基于用户选择的项目主题和需求，生成完整的PBL项目核心框架。
        
        选择的主题：{theme_data.get('name', '')}
        主题描述：{theme_data.get('description', '')}
        用户需求：{context.get('requirements', {})}
        
        请生成：
        1. 项目概述（100字以内）
        2. 核心任务描述
        3. 总驱动性问题
        4. 教学目标（知识、技能、态度维度）
        5. 评价标准
        
        请确保内容符合{context.get('requirements', {}).get('grade', '')}学生的认知水平。
        以结构化的JSON格式返回结果。
        """
        
        try:
            response_text = await self.generate_async(prompt)
            try:
                response_data = json.loads(response_text)
                return response_data
            except json.JSONDecodeError:
                return {"raw_response": response_text}
        except Exception as e:
            logger.error(f"主题框架生成失败: {e}")
            raise
    
    async def recommend_activities(self, stage: str, context: Dict[str, Any], available_cards: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """  推荐活动卡 """
        prompt = f"""
        作为一个专业PBL教学设计专家，请基于以下信息推荐最适合的教学活动。
        
        当前阶段：{stage}
        项目信息：{context.get('theme', {})}
        用户需求：{context.get('requirements', {})}
        
        可选活动卡：
        {json.dumps(available_cards, ensure_ascii=False, indent=2)}
        
        请从上述活动卡中推荐最适合的活动，考虑因素：
        1. 活动与教学目标的匹配度
        2. 适合的年级和学科
        3. 时间和资源约束
        4. 学生参与度和实施可行性
        
        请返回推荐的活动卡ID列表和推荐理由。
        以JSON格式返回：{{"recommended_activities": ["A01", "A05", "A10"], "rationale": "推荐理由"}}
        """
        
        try:
            response_text = await self.generate_async(prompt)
            try:
                response_data = json.loads(response_text)
                return response_data
            except json.JSONDecodeError:
                return {"raw_response": response_text}
        except Exception as e:
            logger.error(f"活动推荐失败: {e}")
            raise
    
    async def match_tools_for_activities(self, activities: List[Dict[str, Any]], available_tools: List[Dict[str, Any]]) -> Dict[str, Any]:
        """  为活动匹配工具卡 """
        prompt = f"""
        作为一个专业PBL教学设计专家，请为以下教学活动匹配最适合的工具卡。
        
        选定的活动：
        {json.dumps(activities, ensure_ascii=False, indent=2)}
        
        可选工具卡：
        {json.dumps(available_tools, ensure_ascii=False, indent=2)}
        
        请为每个活动推荐最适合的工具卡，考虑因素：
        1. 工具与活动的匹配度
        2. 工具的实用性和易用性
        3. 学生的操作难度
        4. 工具的教学效果
        
        以JSON格式返回结果。
        """
        
        try:
            response_text = await self.generate_async(prompt)
            try:
                response_data = json.loads(response_text)
                return response_data
            except json.JSONDecodeError:
                return {"raw_response": response_text}
        except Exception as e:
            logger.error(f"工具匹配失败: {e}")
            raise
    
    async def generate_final_solution(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """  生成最终的完整方案 """
        prompt = f"""
        基于四个阶段的设计结果，生成完整的PBL教学方案。
        
        项目数据：
        {json.dumps(project_data, ensure_ascii=False, indent=2)}
        
        请生成包含以下内容的完整方案：
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
        
        以结构化的JSON格式返回结果。
        """
        
        try:
            response_text = await self.generate_async(prompt)
            try:
                response_data = json.loads(response_text)
                return response_data
            except json.JSONDecodeError:
                return {"raw_response": response_text}
        except Exception as e:
            logger.error(f"最终方案生成失败: {e}")
            raise

# 全局Gemini客户端实例
_gemini_client = None

def get_gemini_client() -> GeminiClient:
    """  获取Gemini客户端实例 """
    global _gemini_client
    if _gemini_client is None:
        _gemini_client = GeminiClient()
    return _gemini_client