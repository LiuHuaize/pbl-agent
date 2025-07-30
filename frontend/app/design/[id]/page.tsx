"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, ArrowRight, Check, MessageCircle, BookOpen, Target, Download } from "lucide-react"
import Link from "next/link"

export default function DesignWorkspacePage() {
  const [currentStage, setCurrentStage] = useState(1)
  const [chatMessages, setChatMessages] = useState([
    {
      type: "ai",
      content:
        "您好！我是您的AI教学设计助手。让我们开始为您的《长安的荔枝》项目设计一个精彩的PBL方案。首先，我需要了解一些基本信息。",
    },
  ])

  const stages = [
    { id: 1, name: "需求调研", completed: true, current: true },
    { id: 2, name: "主题设计", completed: false, current: false },
    { id: 3, name: "教学流程", completed: false, current: false },
    { id: 4, name: "资源匹配", completed: false, current: false },
  ]

  const themeOptions = [
    {
      id: 1,
      title: "历史文学融合探究",
      description: "通过《长安的荔枝》探索唐代历史文化与文学表达的关系",
      subjects: ["语文", "历史"],
      deliverables: ["历史调研报告", "文学作品分析", "创意表演"],
    },
    {
      id: 2,
      title: "古代物流系统研究",
      description: "以荔枝运输为切入点，研究古代物流体系与现代对比",
      subjects: ["历史", "地理", "数学"],
      deliverables: ["路线图设计", "成本分析报告", "创新方案"],
    },
    {
      id: 3,
      title: "文化传承与创新",
      description: "探索传统文化在现代社会的传承与创新表达方式",
      subjects: ["语文", "美术", "信息技术"],
      deliverables: ["文化产品设计", "数字化展示", "推广方案"],
    },
  ]

  const projectPreview = {
    title: "《长安的荔枝》历史文学融合项目",
    grade: "初二",
    subject: "语文+历史",
    duration: "2周",
    selectedTheme: themeOptions[0],
    coreFramework: {
      overview: "通过马伯庸的《长安的荔枝》，让学生深入了解唐代历史文化背景，培养文学鉴赏能力和历史思维。",
      tasks: ["阅读并分析《长安的荔枝》", "调研唐代历史文化背景", "创作相关文学作品", "设计历史情境表演"],
      drivingQuestion: "如何通过一颗荔枝，窥见整个唐代社会的运作机制？",
    },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回首页
                </Link>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{projectPreview.title}</h1>
                <p className="text-sm text-gray-500">
                  {projectPreview.grade} · {projectPreview.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出预览
              </Button>
              <Button variant="outline" size="sm">
                保存草稿
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-140px)]">
          {/* Left Sidebar - Progress Navigation */}
          <div className="col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">设计进度</CardTitle>
                <div className="flex items-center space-x-2">
                  <Progress value={25} className="flex-1" />
                  <span className="text-sm text-gray-500">25%</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <div
                      key={stage.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        stage.current
                          ? "bg-blue-50 border-2 border-blue-200"
                          : stage.completed
                            ? "bg-green-50 hover:bg-green-100"
                            : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onClick={() => stage.completed && setCurrentStage(stage.id)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          stage.completed
                            ? "bg-green-500 text-white"
                            : stage.current
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {stage.completed ? <Check className="w-4 h-4" /> : stage.id}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            stage.current ? "text-blue-900" : stage.completed ? "text-green-900" : "text-gray-600"
                          }`}
                        >
                          {stage.name}
                        </p>
                        {stage.current && <p className="text-sm text-blue-600">进行中</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-6">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>主题共创</span>
                </CardTitle>
                <CardDescription>AI为您推荐了3个主题方案，请选择最符合您教学目标的方案</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100%-120px)]">
                  <div className="space-y-4">
                    {themeOptions.map((theme) => (
                      <Card key={theme.id} className="border-2 hover:border-blue-300 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">{theme.title}</h3>
                            <Button size="sm" variant="outline">
                              选择
                            </Button>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{theme.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {theme.subjects.map((subject) => (
                              <Badge key={subject} variant="secondary">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">预期产出物：</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {theme.deliverables.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* AI Chat Interface */}
            <Card className="mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <MessageCircle className="w-4 h-4" />
                  <span>AI助手对话</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                          message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="向AI助手提问或反馈..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button size="sm">发送</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Real-time Preview */}
          <div className="col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">方案预览</CardTitle>
                <CardDescription>实时查看您的设计进度</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100%-80px)]">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">项目概述</h4>
                      <p className="text-sm text-gray-600">{projectPreview.coreFramework.overview}</p>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">核心任务</h4>
                      <ul className="space-y-1">
                        {projectPreview.coreFramework.tasks.map((task, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">驱动问题</h4>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">{projectPreview.coreFramework.drivingQuestion}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">项目信息</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">年级：</span>
                          <span className="text-gray-900">{projectPreview.grade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">学科：</span>
                          <span className="text-gray-900">{projectPreview.subject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">时长：</span>
                          <span className="text-gray-900">{projectPreview.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 flex justify-between">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            下一步
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
