# OpenRouter Gemini 2.5 Pro 使用指南

## 概述
本文档介绍如何使用OpenRouter API调用Google的Gemini 2.5 Pro模型。

## 基本配置

### 1. 安装依赖
```bash
pip install openai requests
```

### 2. 基本调用方法

#### 使用OpenAI SDK（推荐）
```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")  # 使用环境变量,
)

completion = client.chat.completions.create(
    extra_headers={
        "HTTP-Referer": "https://your-site.com",  # 可选：用于OpenRouter排名
        "X-Title": "Your App Name",  # 可选：用于OpenRouter排名
    },
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": "你好，请介绍一下你的能力。"
        }
    ]
)

print(completion.choices[0].message.content)
```

#### 使用requests库
```python
import os
import requests
import json

url = "https://openrouter.ai/api/v1/chat/completions"
headers = {
    "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
    "HTTP-Referer": "https://your-site.com",
    "X-Title": "Your App Name",
    "Content-Type": "application/json"
}

payload = {
    "model": "google/gemini-2.5-pro",
    "messages": [
        {
            "role": "user",
            "content": "你好，请介绍一下你的能力。"
        }
    ]
}

response = requests.post(url, headers=headers, json=payload)
print(response.json()['choices'][0]['message']['content'])
```

## 高级功能

### 1. 图像处理
Gemini 2.5 Pro支持图像输入：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")  # 使用环境变量,
)

completion = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "描述这张图片的内容"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.jpg"
                    }
                }
            ]
        }
    ]
)

print(completion.choices[0].message.content)
```

### 2. 流式响应
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")  # 使用环境变量,
)

stream = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": "写一个关于人工智能的短文。"
        }
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

### 3. 使用统计
启用使用统计跟踪：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")  # 使用环境变量,
)

completion = client.chat.completions.create(
    model="google/gemini-2.5-pro",
    messages=[
        {
            "role": "user",
            "content": "你好！"
        }
    ],
    usage={
        "include": True
    }
)

print(f"响应内容: {completion.choices[0].message.content}")
print(f"使用统计: {completion.usage}")
```

## 错误处理
```python
from openai import OpenAI
import openai

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")  # 使用环境变量,
)

try:
    completion = client.chat.completions.create(
        model="google/gemini-2.5-pro",
        messages=[
            {
                "role": "user",
                "content": "你好！"
            }
        ]
    )
    print(completion.choices[0].message.content)
except openai.APIError as e:
    print(f"OpenAI API错误: {e}")
except Exception as e:
    print(f"其他错误: {e}")
```

## 注意事项

1. **API密钥安全**: 请勿在代码中硬编码API密钥，建议使用环境变量。
2. **费用控制**: Gemini 2.5 Pro是付费模型，请监控使用量。
3. **速率限制**: 注意API调用频率限制。
4. **模型限制**: 不同模型有不同的输入/输出限制。

## 环境变量配置
建议使用环境变量存储API密钥：

```bash
export OPENROUTER_API_KEY="your_actual_api_key_here"
```

然后在代码中：
```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)
```

## 完整示例
参考项目中的 `test_openrouter_gemini.py` 文件查看完整的测试示例。