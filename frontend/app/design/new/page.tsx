"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectName: "",
    grade: "",
    subject: "",
    classSize: "",
    duration: "",
    objectives: "",
    resources: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // 这里会保存项目数据并跳转到设计工作台
    router.push("/design/1")
  }

  const isFormValid =
    formData.projectName && formData.grade && formData.subject && formData.classSize && formData.duration

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <h1 className="text-xl font-bold text-gray-900">创建新项目</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">开始您的PBL教学设计</h2>
          <p className="text-gray-600">请填写基本信息，AI将为您量身定制教学方案</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>项目基本信息</CardTitle>
            <CardDescription>这些信息将帮助AI更好地理解您的需求，为您推荐最合适的教学方案</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="projectName">项目名称 *</Label>
                <Input
                  id="projectName"
                  placeholder="例如：《长安的荔枝》历史文学融合项目"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange("projectName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">年级 *</Label>
                <Select value={formData.grade} onValueChange={(value) => handleInputChange("grade", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择年级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="小学一年级">小学一年级</SelectItem>
                    <SelectItem value="小学二年级">小学二年级</SelectItem>
                    <SelectItem value="小学三年级">小学三年级</SelectItem>
                    <SelectItem value="小学四年级">小学四年级</SelectItem>
                    <SelectItem value="小学五年级">小学五年级</SelectItem>
                    <SelectItem value="小学六年级">小学六年级</SelectItem>
                    <SelectItem value="初一">初一</SelectItem>
                    <SelectItem value="初二">初二</SelectItem>
                    <SelectItem value="初三">初三</SelectItem>
                    <SelectItem value="高一">高一</SelectItem>
                    <SelectItem value="高二">高二</SelectItem>
                    <SelectItem value="高三">高三</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subject">主要学科 *</Label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择学科" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="语文">语文</SelectItem>
                    <SelectItem value="数学">数学</SelectItem>
                    <SelectItem value="英语">英语</SelectItem>
                    <SelectItem value="物理">物理</SelectItem>
                    <SelectItem value="化学">化学</SelectItem>
                    <SelectItem value="生物">生物</SelectItem>
                    <SelectItem value="历史">历史</SelectItem>
                    <SelectItem value="地理">地理</SelectItem>
                    <SelectItem value="政治">政治</SelectItem>
                    <SelectItem value="科学">科学</SelectItem>
                    <SelectItem value="跨学科">跨学科</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="classSize">班级规模 *</Label>
                <Select value={formData.classSize} onValueChange={(value) => handleInputChange("classSize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择班级规模" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20人以下">20人以下</SelectItem>
                    <SelectItem value="20-30人">20-30人</SelectItem>
                    <SelectItem value="30-40人">30-40人</SelectItem>
                    <SelectItem value="40-50人">40-50人</SelectItem>
                    <SelectItem value="50人以上">50人以上</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">项目时长 *</Label>
              <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择项目时长" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2课时">1-2课时</SelectItem>
                  <SelectItem value="3-5课时">3-5课时</SelectItem>
                  <SelectItem value="1周">1周</SelectItem>
                  <SelectItem value="2周">2周</SelectItem>
                  <SelectItem value="1个月">1个月</SelectItem>
                  <SelectItem value="1学期">1学期</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">教学目标</Label>
              <Textarea
                id="objectives"
                placeholder="请描述您希望学生通过这个项目达到的学习目标..."
                value={formData.objectives}
                onChange={(e) => handleInputChange("objectives", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resources">可用资源</Label>
              <Textarea
                id="resources"
                placeholder="请描述您可以使用的教学资源，如设备、场地、材料等..."
                value={formData.resources}
                onChange={(e) => handleInputChange("resources", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              取消
            </Link>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            开始AI设计
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
