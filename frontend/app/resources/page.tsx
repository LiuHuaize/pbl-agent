"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BookOpen, FileText, Video, ImageIcon, Download, Heart, Star, Filter } from "lucide-react"
import Link from "next/link"

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("cards")

  const pblCards = [
    {
      id: 1,
      title: "问题导入卡",
      category: "启动阶段",
      description: "通过真实问题情境激发学生学习兴趣，引导学生思考",
      tags: ["问题设计", "情境创设"],
      stage: "项目启动",
      difficulty: "基础",
      likes: 156,
      downloads: 89,
    },
    {
      id: 2,
      title: "小组合作卡",
      category: "实施阶段",
      description: "指导学生进行有效的小组合作，分工明确，协作高效",
      tags: ["团队协作", "角色分工"],
      stage: "项目实施",
      difficulty: "中级",
      likes: 203,
      downloads: 134,
    },
    {
      id: 3,
      title: "成果展示卡",
      category: "总结阶段",
      description: "多样化的成果展示方式，培养学生表达和展示能力",
      tags: ["成果展示", "表达能力"],
      stage: "项目总结",
      difficulty: "高级",
      likes: 178,
      downloads: 92,
    },
    {
      id: 4,
      title: "反思评价卡",
      category: "评价阶段",
      description: "引导学生进行深度反思，促进元认知发展",
      tags: ["反思评价", "元认知"],
      stage: "项目评价",
      difficulty: "中级",
      likes: 145,
      downloads: 76,
    },
  ]

  const teachingResources = [
    {
      id: 1,
      title: "《长安的荔枝》教学课件",
      type: "presentation",
      format: "PPT",
      size: "15.2MB",
      description: "包含历史背景、文学分析、互动环节的完整课件",
      subject: "语文+历史",
      grade: "初二",
      rating: 4.8,
      downloads: 245,
    },
    {
      id: 2,
      title: "PBL项目设计模板",
      type: "document",
      format: "DOCX",
      size: "2.1MB",
      description: "标准化的PBL项目设计模板，包含各阶段要素",
      subject: "通用",
      grade: "全年级",
      rating: 4.9,
      downloads: 567,
    },
    {
      id: 3,
      title: "科学实验操作视频",
      type: "video",
      format: "MP4",
      size: "128MB",
      description: "详细的实验操作演示，适合物理化学项目使用",
      subject: "科学",
      grade: "初中",
      rating: 4.7,
      downloads: 189,
    },
    {
      id: 4,
      title: "项目评价量规表",
      type: "document",
      format: "XLSX",
      size: "856KB",
      description: "多维度的项目评价量规，支持过程性和终结性评价",
      subject: "通用",
      grade: "全年级",
      rating: 4.6,
      downloads: 334,
    },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "presentation":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "document":
        return <FileText className="w-5 h-5 text-green-600" />
      case "video":
        return <Video className="w-5 h-5 text-red-600" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-purple-600" />
      default:
        return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "基础":
        return "bg-green-100 text-green-800"
      case "中级":
        return "bg-yellow-100 text-yellow-800"
      case "高级":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
              <h1 className="text-xl font-bold text-gray-900">资源库</h1>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              筛选
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索资源..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="cards">PBL卡片库</TabsTrigger>
            <TabsTrigger value="resources">教学资源</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pblCards.map((card) => (
                <Card key={card.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{card.title}</CardTitle>
                        <Badge variant="outline" className="mb-2">
                          {card.category}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">阶段：</span>
                        <span className="font-medium">{card.stage}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">难度：</span>
                        <Badge className={getDifficultyColor(card.difficulty)}>{card.difficulty}</Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{card.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{card.downloads}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-transparent" variant="outline">
                        查看详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachingResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getTypeIcon(resource.type)}
                        <div>
                          <CardTitle className="text-lg mb-2">{resource.title}</CardTitle>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{resource.format}</Badge>
                            <span className="text-sm text-gray-500">{resource.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">学科：</span>
                        <span className="font-medium">{resource.subject}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">年级：</span>
                        <span className="font-medium">{resource.grade}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{resource.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Download className="w-4 h-4" />
                          <span>{resource.downloads}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-transparent" variant="outline">
                          预览
                        </Button>
                        <Button className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Featured Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">精选推荐</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">157张专业PBL卡片</CardTitle>
                <CardDescription className="text-blue-700">
                  涵盖项目式学习全流程的专业指导卡片，经过教育专家精心设计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-800">
                    <p>• 四大阶段完整覆盖</p>
                    <p>• 多种难度层次</p>
                    <p>• 实用性强</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">立即浏览</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-xl text-green-900">优质教学资源</CardTitle>
                <CardDescription className="text-green-700">
                  精选的教学课件、模板、视频等资源，助力高效教学设计
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-green-800">
                    <p>• 多格式资源支持</p>
                    <p>• 专业质量保证</p>
                    <p>• 持续更新</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">探索资源</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
