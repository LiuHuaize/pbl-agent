"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last-3-months")

  const overviewStats = [
    {
      title: "总项目数",
      value: "28",
      change: "+12%",
      trend: "up",
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      description: "相比上个季度",
    },
    {
      title: "完成率",
      value: "82%",
      change: "+5%",
      trend: "up",
      icon: <Target className="w-5 h-5 text-green-600" />,
      description: "项目完成率",
    },
    {
      title: "学生参与",
      value: "1,247",
      change: "+18%",
      trend: "up",
      icon: <Users className="w-5 h-5 text-purple-600" />,
      description: "累计参与学生",
    },
    {
      title: "平均评分",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: <Award className="w-5 h-5 text-yellow-600" />,
      description: "学生反馈评分",
    },
  ]

  const subjectDistribution = [
    { subject: "语文", count: 8, percentage: 28.6, color: "bg-blue-500" },
    { subject: "数学", count: 6, percentage: 21.4, color: "bg-green-500" },
    { subject: "英语", count: 4, percentage: 14.3, color: "bg-purple-500" },
    { subject: "科学", count: 5, percentage: 17.9, color: "bg-yellow-500" },
    { subject: "跨学科", count: 5, percentage: 17.9, color: "bg-red-500" },
  ]

  const gradeDistribution = [
    { grade: "初一", count: 9, percentage: 32.1 },
    { grade: "初二", count: 12, percentage: 42.9 },
    { grade: "初三", count: 7, percentage: 25.0 },
  ]

  const monthlyTrend = [
    { month: "9月", projects: 3, completed: 3, students: 126 },
    { month: "10月", projects: 4, completed: 4, students: 168 },
    { month: "11月", projects: 2, completed: 1, students: 84 },
    { month: "12月", projects: 5, completed: 4, students: 210 },
    { month: "1月", projects: 3, completed: 2, students: 132 },
  ]

  const topProjects = [
    {
      title: "《长安的荔枝》历史文学融合项目",
      rating: 4.9,
      students: 45,
      duration: "3周",
      subject: "语文+历史",
      completionRate: 100,
    },
    {
      title: "古诗词音乐剧创作",
      rating: 4.7,
      students: 38,
      duration: "4周",
      subject: "语文+音乐",
      completionRate: 95,
    },
    {
      title: "数学建模解决生活问题",
      rating: 4.6,
      students: 36,
      duration: "3周",
      subject: "数学",
      completionRate: 89,
    },
    {
      title: "智慧城市规划设计",
      rating: 4.8,
      students: 42,
      duration: "4周",
      subject: "地理+数学",
      completionRate: 93,
    },
  ]

  const studentFeedback = [
    { aspect: "项目趣味性", score: 4.8, maxScore: 5 },
    { aspect: "学习收获", score: 4.6, maxScore: 5 },
    { aspect: "团队协作", score: 4.7, maxScore: 5 },
    { aspect: "实践应用", score: 4.5, maxScore: 5 },
    { aspect: "创新思维", score: 4.4, maxScore: 5 },
  ]

  const timeSpentAnalysis = [
    { stage: "需求调研", time: 2.5, percentage: 12.5 },
    { stage: "主题设计", time: 4.2, percentage: 21.0 },
    { stage: "教学流程", time: 8.6, percentage: 43.0 },
    { stage: "资源匹配", time: 4.7, percentage: 23.5 },
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
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">数据分析</h1>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">最近1个月</SelectItem>
                <SelectItem value="last-3-months">最近3个月</SelectItem>
                <SelectItem value="last-6-months">最近6个月</SelectItem>
                <SelectItem value="last-year">最近1年</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {overviewStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${stat.trend === "up" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                  </div>
                  {stat.icon}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>学科分布</span>
              </CardTitle>
              <CardDescription>各学科项目数量分布情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${item.color}`}></div>
                      <span className="font-medium">{item.subject}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={item.percentage} />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{item.count}个</span>
                      <span className="text-sm text-gray-500 w-12">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>年级分布</span>
              </CardTitle>
              <CardDescription>不同年级项目数量统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {gradeDistribution.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.grade}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{item.count}个项目</span>
                        <span className="text-sm text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                    <Progress value={item.percentage} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trend */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>月度趋势</span>
            </CardTitle>
            <CardDescription>项目创建和完成情况月度变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrend.map((month, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 items-center p-4 border rounded-lg">
                  <div className="font-medium">{month.month}</div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{month.projects}</div>
                    <div className="text-xs text-gray-500">创建项目</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{month.completed}</div>
                    <div className="text-xs text-gray-500">完成项目</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{month.students}</div>
                    <div className="text-xs text-gray-500">参与学生</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>优秀项目</span>
              </CardTitle>
              <CardDescription>评分最高的项目列表</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProjects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">{project.title}</h4>
                      <div className="flex items-center space-x-1 ml-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{project.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <Badge variant="outline">{project.subject}</Badge>
                      <span>{project.students}名学生</span>
                      <span>{project.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">完成率</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.completionRate} className="w-16" />
                        <span className="text-sm font-medium">{project.completionRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>学生反馈</span>
              </CardTitle>
              <CardDescription>各维度学生评价平均分</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentFeedback.map((feedback, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{feedback.aspect}</span>
                      <span className="text-sm font-medium">
                        {feedback.score}/{feedback.maxScore}
                      </span>
                    </div>
                    <Progress value={(feedback.score / feedback.maxScore) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Spent Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>设计时间分析</span>
            </CardTitle>
            <CardDescription>各设计阶段平均耗时分布</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {timeSpentAnalysis.map((stage, index) => (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2">{stage.time}h</div>
                  <div className="font-medium text-gray-900 mb-2">{stage.stage}</div>
                  <div className="text-sm text-gray-500">{stage.percentage}%</div>
                  <Progress value={stage.percentage} className="mt-2" />
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">效率提升建议</span>
              </div>
              <p className="text-sm text-blue-700 mt-2">
                通过AI智能推荐，您的教学流程设计时间比传统方式节省了约60%，建议继续使用AI助手优化设计流程。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
