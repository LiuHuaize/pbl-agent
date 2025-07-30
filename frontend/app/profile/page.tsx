"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  BookOpen,
  Award,
  Users,
  Calendar,
  Star,
  Heart,
  Edit,
  Settings,
  Trophy,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  const userInfo = {
    name: "张明华",
    title: "高级语文教师",
    school: "北京市第一中学",
    experience: "15年教学经验",
    avatar: "/placeholder.svg?height=120&width=120",
    joinDate: "2023年3月",
    location: "北京市朝阳区",
    subjects: ["语文", "历史", "跨学科"],
    grades: ["初一", "初二", "初三"],
  }

  const stats = [
    { label: "创建项目", value: 28, icon: <BookOpen className="w-5 h-5 text-blue-600" />, trend: "+3" },
    { label: "完成项目", value: 23, icon: <Award className="w-5 h-5 text-green-600" />, trend: "+2" },
    { label: "受益学生", value: 1247, icon: <Users className="w-5 h-5 text-purple-600" />, trend: "+45" },
    { label: "平均评分", value: 4.8, icon: <Star className="w-5 h-5 text-yellow-600" />, trend: "+0.1" },
  ]

  const achievements = [
    {
      id: 1,
      title: "PBL设计专家",
      description: "完成20个以上优质PBL项目设计",
      icon: <Trophy className="w-6 h-6 text-yellow-600" />,
      earned: true,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "跨学科融合达人",
      description: "设计5个以上跨学科融合项目",
      icon: <Target className="w-6 h-6 text-blue-600" />,
      earned: true,
      date: "2024-01-10",
    },
    {
      id: 3,
      title: "学生喜爱教师",
      description: "项目平均评分达到4.5分以上",
      icon: <Heart className="w-6 h-6 text-red-600" />,
      earned: true,
      date: "2023-12-20",
    },
    {
      id: 4,
      title: "创新教学先锋",
      description: "使用AI工具设计教学方案超过50小时",
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      earned: false,
      progress: 75,
    },
  ]

  const recentProjects = [
    {
      id: 1,
      title: "《长安的荔枝》历史文学融合项目",
      status: "已完成",
      rating: 4.9,
      students: 45,
      completedDate: "2024-01-15",
      subject: "语文+历史",
    },
    {
      id: 2,
      title: "古诗词音乐剧创作",
      status: "已完成",
      rating: 4.7,
      students: 38,
      completedDate: "2024-01-08",
      subject: "语文+音乐",
    },
    {
      id: 3,
      title: "传统文化现代表达",
      status: "设计中",
      rating: null,
      students: 42,
      completedDate: null,
      subject: "语文+美术",
    },
  ]

  const monthlyActivity = [
    { month: "9月", projects: 3, students: 126 },
    { month: "10月", projects: 4, students: 168 },
    { month: "11月", projects: 2, students: 84 },
    { month: "12月", projects: 5, students: 210 },
    { month: "1月", projects: 3, students: 132 },
  ]

  const favoriteResources = [
    {
      id: 1,
      title: "问题导入卡",
      type: "PBL卡片",
      category: "启动阶段",
      usedCount: 12,
    },
    {
      id: 2,
      title: "《长安的荔枝》教学课件",
      type: "教学资源",
      category: "课件模板",
      usedCount: 8,
    },
    {
      id: 3,
      title: "小组合作评价量规",
      type: "评价工具",
      category: "评价阶段",
      usedCount: 15,
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
              <h1 className="text-xl font-bold text-gray-900">个人中心</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                编辑资料
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt={userInfo.name} />
                <AvatarFallback className="text-2xl">{userInfo.name.slice(0, 2)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{userInfo.name}</h2>
                <p className="text-lg text-gray-600 mb-2">{userInfo.title}</p>
                <p className="text-gray-600 mb-3">
                  {userInfo.school} • {userInfo.experience}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {userInfo.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                  {userInfo.grades.map((grade) => (
                    <Badge key={grade} variant="outline">
                      {grade}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>加入时间：{userInfo.joinDate}</span>
                  </div>
                  <span>•</span>
                  <span>{userInfo.location}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <Badge variant="secondary" className="text-xs text-green-700 bg-green-100">
                        {stat.trend}
                      </Badge>
                    </div>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="projects">项目</TabsTrigger>
            <TabsTrigger value="achievements">成就</TabsTrigger>
            <TabsTrigger value="resources">收藏</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>最近项目</CardTitle>
                  <CardDescription>您最近创建和完成的项目</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{project.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Badge variant="outline" className="text-xs">
                              {project.subject}
                            </Badge>
                            <span>•</span>
                            <span>{project.students}名学生</span>
                            {project.rating && (
                              <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-500" />
                                  <span>{project.rating}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={
                            project.status === "已完成" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>月度活跃度</CardTitle>
                  <CardDescription>过去5个月的项目创建和学生参与情况</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyActivity.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <span>{month.projects}个项目</span>
                              <span>•</span>
                              <span>{month.students}名学生</span>
                            </div>
                            <Progress value={(month.projects / 5) * 100} className="mt-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>我的项目</CardTitle>
                <CardDescription>查看您创建的所有PBL项目</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">项目详情</h3>
                  <p className="text-gray-500 mb-4">在这里可以查看您的所有项目详细信息</p>
                  <Button asChild>
                    <Link href="/projects">查看所有项目</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.earned ? "border-yellow-200 bg-yellow-50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${achievement.earned ? "bg-yellow-100" : "bg-gray-100"}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>

                        {achievement.earned ? (
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-100 text-yellow-800">已获得</Badge>
                            <span className="text-sm text-gray-500">{achievement.date}</span>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">进度</span>
                              <span className="text-sm font-medium">{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>收藏的资源</CardTitle>
                <CardDescription>您经常使用的PBL卡片和教学资源</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                          <span>•</span>
                          <span>{resource.category}</span>
                          <span>•</span>
                          <span>使用{resource.usedCount}次</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="w-4 h-4 text-red-500" />
                        </Button>
                        <Button variant="outline" size="sm">
                          查看
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
