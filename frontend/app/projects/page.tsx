"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Plus, BookOpen, Calendar, Users, MoreVertical, Eye, Edit, Copy, Trash2 } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const projects = [
    {
      id: 1,
      title: "《长安的荔枝》历史文学融合项目",
      subject: "语文+历史",
      grade: "初二",
      status: "已完成",
      progress: 100,
      lastModified: "2024-01-15",
      description: "通过马伯庸的作品探索唐代历史文化",
      collaborators: 2,
    },
    {
      id: 2,
      title: "环保主题科学探究项目",
      subject: "科学+地理",
      grade: "小学五年级",
      status: "设计中",
      progress: 65,
      lastModified: "2024-01-14",
      description: "培养学生环保意识和科学探究能力",
      collaborators: 1,
    },
    {
      id: 3,
      title: "数学建模与生活应用",
      subject: "数学",
      grade: "初三",
      status: "草稿",
      progress: 25,
      lastModified: "2024-01-13",
      description: "将数学知识应用到实际生活场景中",
      collaborators: 0,
    },
    {
      id: 4,
      title: "英语戏剧表演项目",
      subject: "英语",
      grade: "高一",
      status: "已完成",
      progress: 100,
      lastModified: "2024-01-10",
      description: "通过戏剧表演提升英语口语和表达能力",
      collaborators: 3,
    },
    {
      id: 5,
      title: "物理实验创新设计",
      subject: "物理",
      grade: "高二",
      status: "设计中",
      progress: 40,
      lastModified: "2024-01-08",
      description: "设计创新物理实验，培养科学思维",
      collaborators: 1,
    },
    {
      id: 6,
      title: "化学与生活跨学科项目",
      subject: "化学+生物",
      grade: "高三",
      status: "草稿",
      progress: 15,
      lastModified: "2024-01-05",
      description: "探索化学在日常生活中的应用",
      collaborators: 0,
    },
  ]

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

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    const matchesSubject = subjectFilter === "all" || project.subject.includes(subjectFilter)

    return matchesSearch && matchesStatus && matchesSubject
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
              <h1 className="text-xl font-bold text-gray-900">项目管理</h1>
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              asChild
            >
              <Link href="/design/new">
                <Plus className="w-4 h-4 mr-2" />
                创建新项目
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索项目名称或学科..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="设计中">设计中</SelectItem>
                <SelectItem value="草稿">草稿</SelectItem>
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
                <SelectItem value="科学">科学</SelectItem>
                <SelectItem value="历史">历史</SelectItem>
                <SelectItem value="物理">物理</SelectItem>
                <SelectItem value="化学">化学</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总项目数</p>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
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
                  <p className="text-2xl font-bold text-green-600">
                    {projects.filter((p) => p.status === "已完成").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">设计中</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {projects.filter((p) => p.status === "设计中").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">草稿</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {projects.filter((p) => p.status === "草稿").length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 mb-2">{project.title}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                      <Badge variant="outline">{project.grade}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/design/${project.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/design/${project.id}`}>
                          <Edit className="w-4 h-4 mr-2" />
                          继续编辑
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        克隆项目
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除项目
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">学科：</span>
                    <span className="font-medium">{project.subject}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">进度：</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={project.progress} className="w-16" />
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{project.lastModified}</span>
                    </div>
                    {project.collaborators > 0 && (
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{project.collaborators}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <Button className="w-full" variant={project.status === "草稿" ? "default" : "outline"} asChild>
                    <Link href={`/design/${project.id}`}>{project.status === "草稿" ? "继续设计" : "查看详情"}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到匹配的项目</h3>
            <p className="text-gray-500 mb-6">尝试调整搜索条件或创建新项目</p>
            <Button asChild>
              <Link href="/design/new">
                <Plus className="w-4 h-4 mr-2" />
                创建新项目
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
