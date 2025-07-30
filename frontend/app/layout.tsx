import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Agent辅助PBL教学设计工具',
  description: '基于Gemini-2.5-Pro的四阶段PBL教学设计系统，为教育工作者提供智能化的项目式学习设计支持',
  keywords: ['PBL', '项目式学习', 'AI教学', '教学设计', '教育科技'],
  authors: [{ name: 'PBL Agent Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
