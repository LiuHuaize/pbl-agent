#!/usr/bin/env python3
"""
OpenRouter Gemini 2.5 Pro 测试脚本
测试基本调用、流式响应、错误处理等功能
"""

import os
import sys
import json
import requests
from openai import OpenAI
import openai
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# API配置
API_KEY = os.getenv("OPENROUTER_API_KEY")
BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
MODEL = os.getenv("DEFAULT_MODEL", "google/gemini-2.5-pro")

# 检查API密钥是否存在
if not API_KEY:
    print("❌ 错误：未找到OPENROUTER_API_KEY环境变量")
    print("请在.env文件中设置OPENROUTER_API_KEY")
    sys.exit(1)

def test_basic_call():
    """测试基本API调用"""
    print("🧪 测试基本API调用...")
    
    client = OpenAI(
        base_url=BASE_URL,
        api_key=API_KEY,
    )
    
    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": "你好！请简单介绍一下你的能力。"
                }
            ]
        )
        
        print("✅ 基本调用成功")
        print(f"响应内容: {completion.choices[0].message.content}")
        print(f"模型: {completion.model}")
        print()
        return True
        
    except Exception as e:
        print(f"❌ 基本调用失败: {e}")
        print()
        return False

def test_requests_call():
    """测试使用requests库调用"""
    print("🧪 测试使用requests库调用...")
    
    url = f"{BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": "用一句话介绍人工智能。"
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        print("✅ requests调用成功")
        print(f"响应内容: {result['choices'][0]['message']['content']}")
        print()
        return True
        
    except Exception as e:
        print(f"❌ requests调用失败: {e}")
        print()
        return False

def test_streaming():
    """测试流式响应"""
    print("🧪 测试流式响应...")
    
    client = OpenAI(
        base_url=BASE_URL,
        api_key=API_KEY,
    )
    
    try:
        stream = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": "请写一首关于科技的短诗。"
                }
            ],
            stream=True
        )
        
        print("✅ 流式响应开始:")
        full_response = ""
        for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                print(content, end="", flush=True)
                full_response += content
        
        print("\n✅ 流式响应完成")
        print()
        return True
        
    except Exception as e:
        print(f"❌ 流式响应失败: {e}")
        print()
        return False

def test_with_usage():
    """测试带使用统计的调用"""
    print("🧪 测试带使用统计的调用...")
    
    client = OpenAI(
        base_url=BASE_URL,
        api_key=API_KEY,
    )
    
    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": "什么是量子计算？"
                }
            ],
            extra_body={
                "usage": {
                    "include": True
                }
            }
        )
        
        print("✅ 带使用统计调用成功")
        print(f"响应内容: {completion.choices[0].message.content}")
        if hasattr(completion, 'usage') and completion.usage:
            print(f"使用统计: {completion.usage}")
        print()
        return True
        
    except Exception as e:
        print(f"❌ 带使用统计调用失败: {e}")
        print()
        return False

def test_image_processing():
    """测试图像处理（如果支持）"""
    print("🧪 测试图像处理...")
    
    client = OpenAI(
        base_url=BASE_URL,
        api_key=API_KEY,
    )
    
    try:
        completion = client.chat.completions.create(
            model=MODEL,
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
                                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
                            }
                        }
                    ]
                }
            ]
        )
        
        print("✅ 图像处理成功")
        print(f"响应内容: {completion.choices[0].message.content}")
        print()
        return True
        
    except Exception as e:
        print(f"❌ 图像处理失败: {e}")
        print()
        return False

def test_error_handling():
    """测试错误处理"""
    print("🧪 测试错误处理...")
    
    client = OpenAI(
        base_url=BASE_URL,
        api_key="invalid_key",  # 故意使用无效密钥
    )
    
    try:
        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "user",
                    "content": "测试错误处理"
                }
            ]
        )
        
        print("❌ 错误处理测试失败：应该抛出异常")
        print()
        return False
        
    except openai.APIError as e:
        print(f"✅ 正确捕获API错误: {e}")
        print()
        return True
    except Exception as e:
        print(f"✅ 捕获其他错误: {e}")
        print()
        return True

def main():
    """主测试函数"""
    print("🚀 OpenRouter Gemini 2.5 Pro 测试开始\n")
    
    tests = [
        ("基本API调用", test_basic_call),
        ("requests库调用", test_requests_call),
        ("流式响应", test_streaming),
        ("带使用统计", test_with_usage),
        ("图像处理", test_image_processing),
        ("错误处理", test_error_handling),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"{'='*50}")
        success = test_func()
        results.append((test_name, success))
    
    print(f"{'='*50}")
    print("📊 测试结果汇总:")
    print(f"{'='*50}")
    
    passed = 0
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\n总计: {passed}/{len(results)} 个测试通过")
    
    if passed == len(results):
        print("🎉 所有测试都通过了！")
        return 0
    else:
        print("⚠️  部分测试失败，请检查配置和网络连接")
        return 1

if __name__ == "__main__":
    sys.exit(main())