import { Card, Statistic } from 'antd'
import type { ReactNode } from 'react'
import { useTheme } from '../context/ThemeContext'

type StatCardProps = {
  title: string
  value: number | string
  icon: ReactNode
  suffix?: string
}

function StatCard({ title, value, icon, suffix }: StatCardProps) {
  const { mode } = useTheme()

  return (
    <Card className="metric-card">
      <div className="flex items-center justify-between">
        <Statistic title={title} value={value} suffix={suffix} />
        <div
          className={`rounded p-3 text-xl ${
            mode === 'dark' ? 'bg-[#1c2b3a] text-[#8ec5ff]' : 'bg-[#e6f1ed] text-[#1f6f50]'
          }`}
        >
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default StatCard
