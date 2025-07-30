"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Download,
  Share2,
  Edit,
  BookOpen,
  Users,
  Clock,
  Target,
  CheckCircle,
  FileText,
  Video,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"

export default function ProjectPreviewPage() {
  const [currentSection, setCurrentSection] = useState("overview")

  const projectData = {
    title: "《长安的荔枝》历史文学融合探究项目",
    author: "张明华老师",
    school: "北京市第一中学",
    subject: "语文+历史",
    grade: "初二",
    duration: "3周（15课时）",
    students: 45,
    status: "已完成",
    rating: 4.9,
    completedDate: "2024-01-15",

    overview: {
      description:
        "本项目以马伯庸的《长安的荔枝》为载体，引导学生深入了解唐代历史文化背景，培养文学鉴赏能力和历史思维。通过跨学科融合的方式，让学生在真实情境中探究历史与文学的关系，提升综合素养。",
      objectives: [
        "理解《长安的荔枝》的文学价值和历史背景",
        "培养跨学科思维和综合分析能力",
        "提升团队协作和表达展示能力",
        "增强对中华优秀传统文化的认同感",
      ],
      drivingQuestion: "如何通过一颗荔枝，窥见整个唐代社会的运作机制？",
      coreFramework: {
        overview: "通过马伯庸的《长安的荔枝》，让学生深入了解唐代历史文化背景，培养文学鉴赏能力和历史思维。",
        tasks: ["阅读并分析《长安的荔枝》", "调研唐代历史文化背景", "创作相关文学作品", "设计历史情境表演"],
        outcomes: ["历史调研报告", "文学作品分析", "创意表演", "文化产品设计"],
      },
    },

    stages: [
      {
        id: 1,
        name: "项目启动",
        duration: "2课时",
        description: "通过问题导入，激发学生对唐代历史文化的兴趣",
        activities: [
          {
            name: "问题导入",
            description: "观看《长安的荔枝》相关视频，提出核心驱动问题",
            tools: ["多媒体设备", "视频资料"],
            time: "30分钟",
          },
          {
            name: "小组组建",
            description: "按照兴趣和能力组建4-5人学习小组",
            tools: ["分组卡片", "角色分工表"],
            time: "20分钟",
          },
          {
            name: "项目规划",
            description: "制定小组学习计划和任务分工",
            tools: ["项目规划模板", "时间管理工具"],
            time: "40分钟",
          },
        ],
      },
      {
        id: 2,
        name: "文本研读",
        duration: "4课时",
        description: "深入阅读《长安的荔枝》，分析文学特色和历史背景",
        activities: [
          {
            name: "文本精读",
            description: "分章节精读小说，记录关键信息和疑问",
            tools: ["阅读记录表", "思维导图工具"],
            time: "90分钟",
          },
          {
            name: "文学分析",
            description: "分析小说的叙事技巧、人物塑造和主题思想",
            tools: ["文学分析框架", "讨论记录表"],
            time: "90分钟",
          },
        ],
      },
      {
        id: 3,
        name: "历史探究",
        duration: "5课时",
        description: "深入调研唐代历史文化，理解小说的历史背景",
        activities: [
          {
            name: "历史资料收集",
            description: "收集唐代政治、经济、文化相关资料",
            tools: ["图书馆资源", "网络检索工具", "资料整理模板"],
            time: "120分钟",
          },
          {
            name: "专题研究",
            description: "选择感兴趣的历史专题进行深入研究",
            tools: ["研究报告模板", "数据分析工具"],
            time: "105分钟",
          },
        ],
      },
      {
        id: 4,
        name: "创作实践",
        duration: "3课时",
        description: "基于研究成果，进行文学创作和艺术表达",
        activities: [
          {
            name: "创意写作",
            description: "创作与唐代历史相关的文学作品",
            tools: ["写作指导手册", "同伴互评表"],
            time: "90分钟",
          },
          {
            name: "艺术创作",
            description: "设计制作相关的艺术作品或文化产品",
            tools: ["美术用品", "设计软件", "制作材料"],
            time: "45分钟",
          },
        ],
      },
      {
        id: 5,
        name: "成果展示",
        duration: "1课时",
        description: "展示学习成果，进行反思评价",
        activities: [
          {
            name: "成果展示",
            description: "各小组展示研究成果和创作作品",
            tools: ["展示设备", "评价量规"],
            time: "35分钟",
          },
          {
            name: "反思评价",
            description: "进行自我反思和同伴评价",
            tools: ["反思问卷", "评价表"],
            time: "10分钟",
          },
        ],
      },
    ],

    resources: [
      {
        category: "核心文本",
        items: [
          { name: "《长安的荔枝》", type: "图书", description: "马伯庸著，湖南文艺出版社" },
          { name: "唐代历史资料汇编", type: "文档", description: "相关历史文献和资料" },
        ],
      },
      {
        category: "多媒体资源",
        items: [
          { name: "《长安的荔枝》导读视频", type: "视频", description: "专家解读视频，时长30分钟" },
          { name: "唐代文化纪录片", type: "视频", description: "《大唐风华》系列纪录片片段" },
          { name: "唐代地图集", type: "图片", description: "高清唐代地理位置图" },
        ],
      },
      {
        category: "工具模板",
        items: [
          { name: "阅读记录表", type: "模板", description: "用于记录阅读过程中的思考和疑问" },
          { name: "历史调研报告模板", type: "模板", description: "标准化的调研报告格式" },
          { name: "项目评价量规", type: "评价工具", description: "多维度项目评价标准" },
        ],
      },
    ],

    assessment: {
      methods: ["过程性评价", "终结性评价", "同伴互评", "自我反思"],
      criteria: [
        { aspect: "文本理解", weight: "25%", description: "对《长安的荔枝》文本内容的理解程度" },
        { aspect: "历史认知", weight: "25%", description: "对唐代历史文化的认知深度" },
        { aspect: "创作表达", weight: "25%", description: "创作作品的质量和表达能力" },
        { aspect: "团队协作", weight: "25%", description: "小组合作中的参与度和贡献度" },
      ],
      rubric: {
        excellent: "深入理解文本内涵，历史认知准确全面，创作富有创意，团队协作积极有效",
        good: "较好理解文本内容，历史认知基本准确，创作有一定水平，能够参与团队协作",
        satisfactory: "基本理解文本，历史认知有待深入，创作完成基本要求，团队协作一般",
        needsImprovement: "文本理解浅显，历史认知不够准确，创作质量有待提高，团队协作需要改进",
      },
    },

    outcomes: [
      "学生对《长安的荔枝》有了深入理解，文学鉴赏能力显著提升",
      "通过历史调研，学生对唐代历史文化有了全面认知",
      "创作的文学作品和艺术作品质量较高，展现了学生的创新思维",
      "团队协作能力和表达展示能力得到有效锻炼",
      "学生对中华优秀传统文化的认同感和自豪感明显增强",
    ],

    reflection: {
      successes: [
        "跨学科融合设计有效激发了学生的学习兴趣",
        "真实情境的创设让学生有了深度的学习体验",
        "多元化的评价方式全面反映了学生的学习成果",
        "小组合作学习培养了学生的协作能力",
      ],
      improvements: [
        "可以增加更多的实地考察环节",
        "评价标准可以更加细化和具体",
        "可以邀请专家进行现场指导",
        "时间安排可以更加灵活",
      ],
      nextSteps: [
        "将成功经验推广到其他文学作品的教学中",
        "开发更多跨学科融合的教学资源",
        "建立长期的项目跟踪评价机制",
        "加强与其他学校的交流合作",
      ],
    },
  }

  const sections = [
    { id: "overview", name: "项目概述", icon: <BookOpen className="w-4 h-4" /> },
    { id: "stages", name: "教学流程", icon: <Target className="w-4 h-4" /> },
    { id: "resources", name: "教学资源", icon: <FileText className="w-4 h-4" /> },
    { id: "assessment", name: "评价方案", icon: <CheckCircle className="w-4 h-4" /> },
    { id: "outcomes", name: "项目成果", icon: <Users className="w-4 h-4" /> },
    { id: "reflection", name: "反思总结", icon: <Edit className="w-4 h-4" /> },
  ]

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "视频":
        return <Video className="w-4 h-4 text-red-500" />
      case "图片":
        return <ImageIcon className="w-4 h-4 text-purple-500" />
      default:
        return <FileText className="w-4 h-4 text-blue-500" />
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
                <Link href="/projects">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回项目
                </Link>
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{projectData.title}</h1>
                <p className="text-sm text-gray-500">
                  {projectData.author} • {projectData.school}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                编辑
              </Button>
              <Button size="sm">
                <Download className="w-4 h-4 mr-2" />
                导出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="col-span-3">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-base">项目信息</CardTitle>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">学科：</span>
                    <Badge variant="outline">{projectData.subject}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">年级：</span>
                    <span>{projectData.grade}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">时长：</span>
                    <span>{projectData.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">学生：</span>
                    <span>{projectData.students}人</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">评分：</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-yellow-500" />
                      <span>{projectData.rating}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                        currentSection === section.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {section.icon}
                      <span>{section.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            <ScrollArea className="h-[calc(100vh-140px)]">
              {currentSection === "overview" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>项目概述</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed mb-6">{projectData.overview.description}</p>

                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">学习目标</h4>
                        <ul className="space-y-2">
                          {projectData.overview.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                              <span className="text-gray-700">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">核心驱动问题</h4>
                        <p className="text-blue-800">{projectData.overview.drivingQuestion}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>核心框架</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">主要任务</h4>
                          <ul className="space-y-2">
                            {projectData.overview.coreFramework.tasks.map((task, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">预期成果</h4>
                          <ul className="space-y-2">
                            {projectData.overview.coreFramework.outcomes.map((outcome, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                <span className="text-gray-700">{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentSection === "stages" && (
                <div className="space-y-6">
                  {projectData.stages.map((stage, index) => (
                    <Card key={stage.id}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{stage.id}</span>
                          </div>
                          <div>
                            <CardTitle>{stage.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{stage.duration}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{stage.description}</p>
                        <div className="space-y-4">
                          {stage.activities.map((activity, actIndex) => (
                            <div key={actIndex} className="border-l-4 border-blue-200 pl-4">
                              <h5 className="font-medium text-gray-900 mb-2">{activity.name}</h5>
                              <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-500">工具：</span>
                                  <div className="flex flex-wrap gap-1">
                                    {activity.tools.map((tool, toolIndex) => (
                                      <Badge key={toolIndex} variant="secondary" className="text-xs">
                                        {tool}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{activity.time}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {currentSection === "resources" && (
                <div className="space-y-6">
                  {projectData.resources.map((category, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-start space-x-3 p-3 border rounded-lg">
                              {getResourceIcon(item.type)}
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{item.name}</h5>
                                <p className="text-sm text-gray-600">{item.description}</p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {item.type}
                                </Badge>
                              </div>
                              <Button variant="outline" size="sm">
                                <Download className="w-3 h-3 mr-1" />
                                下载
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {currentSection === "assessment" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>评价方法</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {projectData.assessment.methods.map((method, index) => (
                          <Badge key={index} variant="secondary">
                            {method}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>评价标准</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {projectData.assessment.criteria.map((criterion, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{criterion.aspect}</h5>
                              <p className="text-sm text-gray-600">{criterion.description}</p>
                            </div>
                            <Badge variant="outline">{criterion.weight}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>评价量规</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(projectData.assessment.rubric).map(([level, description]) => (
                          <div key={level} className="p-3 border rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                className={
                                  level === "excellent"
                                    ? "bg-green-100 text-green-800"
                                    : level === "good"
                                      ? "bg-blue-100 text-blue-800"
                                      : level === "satisfactory"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                }
                              >
                                {level === "excellent"
                                  ? "优秀"
                                  : level === "good"
                                    ? "良好"
                                    : level === "satisfactory"
                                      ? "合格"
                                      : "待改进"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">{description}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentSection === "outcomes" && (
                <Card>
                  <CardHeader>
                    <CardTitle>项目成果</CardTitle>
                    <CardDescription>本项目取得的主要成果和效果</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projectData.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <p className="text-gray-700">{outcome}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentSection === "reflection" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-700">成功经验</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {projectData.reflection.successes.map((success, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span className="text-gray-700">{success}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-yellow-700">改进建议</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {projectData.reflection.improvements.map((improvement, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <Target className="w-4 h-4 text-yellow-500 mt-0.5" />
                            <span className="text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-blue-700">后续计划</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {projectData.reflection.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <ArrowLeft className="w-4 h-4 text-blue-500 mt-0.5 rotate-180" />
                            <span className="text-gray-700">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
