"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, BookOpen, Download, Eye, Star, Heart, Users, Clock, Award, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const featuredCases = [
    {
      id: 1,
      title: "《长安的荔枝》历史文学融合探究",
      author: "李明老师",
      school: "北京市第一中学",
      subject: "语文+历史",
      grade: "初二",
      duration: "3周",
      students: 45,
      rating: 4.9,
      views: 2847,
      downloads: 456,
      likes: 189,
      description:
        "通过马伯庸的《长安的荔枝》，让学生深入了解唐代历史文化背景，培养文学鉴赏能力和历史思维。项目融合了文学阅读、历史调研、创意表演等多种学习方式。",
      highlights: ["跨学科融合", "真实情境", "多元评价", "学生主导"],
      outcomes: ["历史调研报告", "文学作品分析", "情境剧表演", "文化产品设计"],
      tags: ["文学", "历史", "跨学科", "创新"],
      featured: true,
    },
    {
      id: 2,
      title: "智慧城市规划设计项目",
      author: "王芳老师",
      school: "上海实验中学",
      subject: "地理+数学+信息技术",
      grade: "高一",
      duration: "4周",
      students: 38,
      rating: 4.8,
      views: 1923,
      downloads: 312,
      likes: 156,
      description:
        "学生以城市规划师的身份，运用地理知识、数学建模和信息技术，设计未来智慧城市方案，培养综合解决问题的能力。",
      highlights: ["STEAM教育", "数字化工具", "团队协作", "创新思维"],
      outcomes: ["城市规划方案", "数据分析报告", "3D模型展示", "可持续发展建议"],
      tags: ["地理", "数学", "信息技术", "STEAM"],
      featured: true,
    },
    {
      id: 3,
      title: "校园生态环境调查与保护",
      author: "张伟老师",
      school: "广州市育才学校",
      subject: "生物+化学+地理",
      grade: "高二",
      duration: "6周",
      students: 42,
      rating: 4.7,
      views: 1654,
      downloads: 278,
      likes: 134,
      description: "学生通过实地调查、数据收集、实验分析等方式，深入了解校园生态环境现状，提出保护和改善方案。",
      highlights: ["实地调研", "科学实验", "数据分析", "环保意识"],
      outcomes: ["环境调查报告", "水质检测数据", "生物多样性统计", "环保行动方案"],
      tags: ["生物", "化学", "环保", "实验"],
      featured: true,
    },
  ]

  const allCases = [
    ...featuredCases,
    {
      id: 4,
      title: "传统节日文化传承项目",
      author: "陈静老师",
      school: "成都市第二中学",
      subject: "语文+美术+音乐",
      grade: "小学五年级",
      duration: "2周",
      students: 35,
      rating: 4.6,
      views: 1432,
      downloads: 198,
      likes: 89,
      description: "通过深入了解传统节日的历史文化内涵，学生创作相关艺术作品，传承和弘扬中华优秀传统文化。",
      highlights: ["文化传承", "艺术创作", "多元表达", "价值认同"],
      outcomes: ["节日文化手册", "艺术作品展", "传统音乐表演", "文化宣传片"],
      tags: ["传统文化", "艺术", "综合实践"],
      featured: false,
    },
    {
      id: 5,
      title: "新能源汽车设计挑战",
      author: "刘强老师",
      school: "深圳科技高中",
      subject: "物理+化学+工程",
      grade: "高三",
      duration: "8周",
      students: 28,
      rating: 4.8,
      views: 2156,
      downloads: 367,
      likes: 203,
      description: "学生组成设计团队，运用物理和化学知识，设计制作新能源汽车模型，培养工程思维和创新能力。",
      highlights: ["工程设计", "科技创新", "团队合作", "实践应用"],
      outcomes: ["汽车模型制作", "技术方案报告", "性能测试数据", "创新专利申请"],
      tags: ["物理", "化学", "工程", "创新"],
      featured: false,
    },
    {
      id: 6,
      title: "社区健康促进计划",
      author: "赵敏老师",
      school: "杭州市实验学校",
      subject: "生物+体育+社会学",
      grade: "初三",
      duration: "5周",
      students: 40,
      rating: 4.5,
      views: 1287,
      downloads: 156,
      likes: 78,
      description: "学生深入社区，调研居民健康状况，设计并实施健康促进活动，培养社会责任感和服务意识。",
      highlights: ["社会实践", "健康教育", "数据调研", "公益服务"],
      outcomes: ["健康调研报告", "促进活动方案", "健康宣传材料", "社区服务记录"],
      tags: ["生物", "体育", "社会实践"],
      featured: false,
    },
    {
      id: 7,
      title: "古诗词音乐剧创作",
      author: "孙丽老师",
      school: "西安市第三中学",
      subject: "语文+音乐+表演",
      grade: "初一",
      duration: "4周",
      students: 32,
      rating: 4.7,
      views: 1876,
      downloads: 234,
      likes: 145,
      description: "学生选择经典古诗词，创作音乐剧本，进行排练表演，在艺术实践中深化对古典文学的理解。",
      highlights: ["文学理解", "艺术创作", "团队协作", "舞台表演"],
      outcomes: ["音乐剧剧本", "原创音乐作品", "舞台表演", "文学赏析报告"],
      tags: ["语文", "音乐", "表演艺术"],
      featured: false,
    },
    {
      id: 8,
      title: "数学建模解决生活问题",
      author: "马超老师",
      school: "天津市育英中学",
      subject: "数学+统计学",
      grade: "高二",
      duration: "3周",
      students: 36,
      rating: 4.6,
      views: 1543,
      downloads: 289,
      likes: 112,
      description: "学生运用数学建模方法，解决校园或社区中的实际问题，培养数学应用能力和逻辑思维。",
      highlights: ["数学应用", "问题解决", "逻辑思维", "实用性强"],
      outcomes: ["数学模型构建", "问题解决方案", "数据分析报告", "应用效果评估"],
      tags: ["数学", "建模", "应用"],
      featured: false,
    },
  ]

  const stats = [
    { label: "优秀案例", value: "156+", icon: <Award className="w-5 h-5 text-yellow-600" /> },
    { label: "参与教师", value: "2,847", icon: <Users className="w-5 h-5 text-blue-600" /> },
    { label: "受益学生", value: "45,623", icon: <BookOpen className="w-5 h-5 text-green-600" /> },
    { label: "平均评分", value: "4.7", icon: <Star className="w-5 h-5 text-purple-600" /> },
  ]

  const filteredCases = allCases.filter((case_) => {
    const matchesSearch =
      case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      case_.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = gradeFilter === "all" || case_.grade === gradeFilter
    const matchesSubject = subjectFilter === "all" || case_.subject.includes(subjectFilter)

    return matchesSearch && matchesGrade && matchesSubject
  })

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
              <h1 className="text-xl font-bold text-gray-900">优秀案例</h1>
            </div>
            <Button variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              提交案例
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">优秀PBL教学案例展示</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            汇聚全国优秀教师的PBL教学实践案例，为您提供丰富的设计灵感和实施参考
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索案例标题或学科..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="年级筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部年级</SelectItem>
                <SelectItem value="小学五年级">小学五年级</SelectItem>
                <SelectItem value="初一">初一</SelectItem>
                <SelectItem value="初二">初二</SelectItem>
                <SelectItem value="初三">初三</SelectItem>
                <SelectItem value="高一">高一</SelectItem>
                <SelectItem value="高二">高二</SelectItem>
                <SelectItem value="高三">高三</SelectItem>
              </SelectContent>
            </Select>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="学科筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部学科</SelectItem>
                <SelectItem value="语文">语文</SelectItem>
                <SelectItem value="数学">数学</SelectItem>
                <SelectItem value="英语">英语</SelectItem>
                <SelectItem value="物理">物理</SelectItem>
                <SelectItem value="化学">化学</SelectItem>
                <SelectItem value="生物">生物</SelectItem>
                <SelectItem value="历史">历史</SelectItem>
                <SelectItem value="地理">地理</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="featured">精选案例</TabsTrigger>
            <TabsTrigger value="all">全部案例</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-6">
            {/* Featured Cases */}
            <div className="space-y-8">
              {featuredCases.map((case_, index) => (
                <Card key={case_.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 mb-2">精选案例</Badge>
                        <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{case_.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="w-4 h-4" />
                            <span>{case_.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{case_.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{case_.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                            <span>{case_.author}</span>
                            <span>•</span>
                            <span>{case_.school}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="outline">{case_.grade}</Badge>
                            <Badge variant="outline">{case_.subject}</Badge>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{case_.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{case_.students}人</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-medium">{case_.rating}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4">{case_.description}</p>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">项目亮点：</h4>
                        <div className="flex flex-wrap gap-2">
                          {case_.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">学习成果：</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {case_.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {case_.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </Button>
                          <Button size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            下载案例
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="all" className="mt-6">
            {/* All Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((case_) => (
                <Card key={case_.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2 mb-2">{case_.title}</CardTitle>
                        <div className="flex items-center space-x-2 mb-2">
                          {case_.featured && <Badge className="bg-yellow-100 text-yellow-800">精选</Badge>}
                          <Badge variant="outline">{case_.grade}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            {case_.author} • {case_.school}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{case_.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{case_.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">学科：</span>
                        <span className="font-medium">{case_.subject}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">时长：</span>
                        <span className="font-medium">{case_.duration}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">学生数：</span>
                        <span className="font-medium">{case_.students}人</span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{case_.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{case_.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{case_.likes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-transparent" variant="outline" size="sm">
                          查看详情
                        </Button>
                        <Button className="flex-1" size="sm">
                          下载案例
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的案例</h3>
            <p className="text-gray-500">尝试调整搜索条件或浏览其他分类</p>
          </div>
        )}
      </div>
    </div>
  )
}
