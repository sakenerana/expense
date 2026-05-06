import { Card, Statistic } from 'antd'
import type { ReactNode } from 'react'

type StatCardProps = {
  title: string
  value: number | string
  icon: ReactNode
  suffix?: string
}

function StatCard({ title, value, icon, suffix }: StatCardProps) {
  return (
    <Card className="metric-card">
      <div className="flex items-center justify-between">
        <Statistic title={title} value={value} suffix={suffix} />
        <div className="rounded bg-[#e6f1ed] p-3 text-xl text-[#1f6f50]">{icon}</div>
      </div>
    </Card>
  )
}

export default StatCard
