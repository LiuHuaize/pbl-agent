"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, Clock, Award, ArrowRight, Plus } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [recentProjects] = useState([
    {
      id: 1,
      title: "《长安的荔枝》历史文学融合项目",
      subject: "语文+历史",
      grade: "初二",
      status: "已完成",
      progress: 100,
      lastModified: "2024-01-15",
    },
    {
      id: 2,
      title: "环保主题科学探究项目",
      subject: "科学+地理",
      grade: "小学五年级",
      status: "设计中",
      progress: 65,
      lastModified: "2024-01-14",
    },
    {
      id: 3,
      title: "数学建模与生活应用",
      subject: "数学",
      grade: "初三",
      status: "草稿",
      progress: 25,
      lastModified: "2024-01-13",
    },
    {
      id: 4,
      title: "人工智能与未来生活",
      subject: "信息技术",
      grade: "高中一年级",
      status: "设计中",
      progress: 40,
      lastModified: "2024-01-12",
    },
    {
      id: 5,
      title: "太空探索与宇宙奥秘",
      subject: "物理+天文",
      grade: "初一",
      status: "已完成",
      progress: 100,
      lastModified: "2024-01-11",
    },
    {
      id: 6,
      title: "编程思维启蒙",
      subject: "信息技术",
      grade: "小学四年级",
      status: "草稿",
      progress: 10,
      lastModified: "2024-01-10",
    },
    {
      id: 7,
      title: "健康饮食与营养均衡",
      subject: "生物+健康",
      grade: "小学六年级",
      status: "设计中",
      progress: 75,
      lastModified: "2024-01-09",
    },
    {
      id: 8,
      title: "世界文化遗产之旅",
      subject: "历史+地理",
      grade: "初二",
      status: "已完成",
      progress: 100,
      lastModified: "2024-01-08",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800"
      case "设计中":
        return "bg-blue-100 text-blue-800"
      case "草稿":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">亿小步AI Agent</h1>
              <span className="text-sm text-gray-500">PBL教学设计工具</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/help">使用指南</Link>
              </Button>
              <Button variant="outline">张老师</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎回来，张老师</h2>
          <p className="text-gray-600">让AI助您轻松创建专业的PBL教学方案</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总项目数</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-green-600">8</p>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">设计中</p>
                  <p className="text-2xl font-bold text-blue-600">3</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">协作项目</p>
                  <p className="text-2xl font-bold text-purple-600">2</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
                <CardDescription>开始您的PBL教学设计之旅</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" size="lg" asChild>
                  <Link href="/design/new">
                    <Plus className="w-5 h-5 mr-2" />
                    创建新项目
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/projects">
                    <BookOpen className="w-5 h-5 mr-2" />
                    查看所有项目
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/resources">
                    <Award className="w-5 h-5 mr-2" />
                    浏览资源库
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/cases">
                    <Users className="w-5 h-5 mr-2" />
                    优秀案例
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>最近项目</CardTitle>
                  <CardDescription>继续您的教学设计工作</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/projects">
                    查看全部
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-medium text-gray-900">{project.title}</h3>
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{project.subject}</span>
                          <span>{project.grade}</span>
                          <span>更新于 {project.lastModified}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center space-x-2">
                            <Progress value={project.progress} className="flex-1" />
                            <span className="text-sm text-gray-500">{project.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/design/${project.id}`}>
                          继续设计
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">为什么选择亿小步AI Agent？</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">专业卡片体系</h4>
                <p className="text-gray-600 text-sm">基于157张专业PBL卡片，智能匹配最适合的教学方案</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">高效设计流程</h4>
                <p className="text-gray-600 text-sm">四阶段渐进式设计，将数周工作压缩到几小时</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">人机协作体验</h4>
                <p className="text-gray-600 text-sm">AI智能引导与教师专业判断完美结合</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
