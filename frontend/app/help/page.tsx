"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Play, FileText, MessageCircle, Lightbulb, Users, Target, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const steps = [
    {
      id: 1,
      title: "创建项目",
      description: "填写基本信息，让AI了解您的教学需求",
      icon: <Target className="w-6 h-6 text-blue-600" />,
      details: ["选择年级和学科", "设定班级规模和项目时长", "描述教学目标和可用资源"],
    },
    {
      id: 2,
      title: "需求调研",
      description: "AI深入了解您的具体需求和教学环境",
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      details: ["回答AI的针对性问题", "确认教学重点和难点", "明确学生特点和基础"],
    },
    {
      id: 3,
      title: "主题共创",
      description: "AI推荐主题方案，与您共同确定最佳选择",
      icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
      details: ["查看AI推荐的3个主题方案", "选择最符合需求的主题", "完善核心框架和驱动问题"],
    },
    {
      id: 4,
      title: "教学流程设计",
      description: "设计五个教学阶段的具体活动和工具",
      icon: <Users className="w-6 h-6 text-purple-600" />,
      details: ["选择适合的活动卡片", "匹配相应的工具卡", "确定合作方式和组织形式"],
    },
    {
      id: 5,
      title: "资源匹配",
      description: "为项目匹配合适的教学资源和材料",
      icon: <FileText className="w-6 h-6 text-red-600" />,
      details: ["浏览分类教学资源", "选择合适的资源材料", "生成完整教学方案"],
    },
  ]

  const faqs = [
    {
      question: "什么是PBL教学法？",
      answer:
        "PBL（Project-Based Learning）即项目式学习，是一种以学生为中心的教学方法。学生通过完成真实的项目任务来学习知识、发展技能。这种方法能够培养学生的批判性思维、协作能力和解决问题的能力。",
    },
    {
      question: "AI如何帮助我设计教学方案？",
      answer:
        "我们的AI基于157张专业PBL卡片和丰富的教学经验数据，能够根据您的具体需求智能推荐合适的教学主题、活动设计和资源配置。AI会在整个设计过程中提供个性化指导，确保方案的专业性和实用性。",
    },
    {
      question: "设计一个完整的PBL方案需要多长时间？",
      answer:
        "使用我们的AI工具，通常可以在2-4小时内完成一个完整的PBL教学方案设计。这比传统的手工设计方式节省了大量时间，让您能够专注于教学内容的优化和个性化调整。",
    },
    {
      question: "生成的教学方案可以修改吗？",
      answer:
        "当然可以！我们的系统支持在任何阶段回到之前的步骤进行修改。您可以调整主题选择、修改活动设计、更换教学资源等。AI会根据您的修改重新优化整个方案。",
    },
    {
      question: "如何导出和使用生成的教学方案？",
      answer:
        "完成设计后，您可以选择多种导出格式：完整方案包、教师指导版、学生材料包等。导出的文件包含详细的教学步骤、活动指导、评价量规等，可以直接用于课堂教学。",
    },
    {
      question: "是否支持多人协作设计？",
      answer:
        "目前我们支持项目分享和协作功能。您可以邀请其他教师参与项目设计，共同完善教学方案。未来我们还将推出更多协作功能。",
    },
  ]

  const videoTutorials = [
    {
      id: 1,
      title: "快速入门：5分钟创建您的第一个PBL项目",
      duration: "5:23",
      views: "1.2k",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "深度解析：如何选择最适合的主题方案",
      duration: "8:45",
      views: "856",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "实战案例：《长安的荔枝》项目设计全流程",
      duration: "12:30",
      views: "2.1k",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

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
              <h1 className="text-xl font-bold text-gray-900">使用指南</h1>
            </div>
            <Button asChild>
              <Link href="/design/new">开始设计</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">让AI助您轻松创建专业PBL教学方案</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            通过四个简单步骤，将复杂的教学设计工作压缩到几小时内完成
          </p>
        </div>

        {/* Steps Guide */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">设计流程</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Video Tutorials */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">视频教程</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTutorials.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-lg">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                  <Badge className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                  <p className="text-sm text-gray-500">{video.views} 次观看</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">常见问题</h3>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>需要更多帮助？</CardTitle>
              <CardDescription>我们的支持团队随时为您提供专业的技术支持和教学指导</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  在线客服
                </Button>
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  提交工单
                </Button>
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  查看文档
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
