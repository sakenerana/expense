import {
  DollarCircleOutlined,
  RiseOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Card, Col, Progress, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import StatCard from '../components/StatCard'

type ActivityItem = {
  key: string
  action: string
  user: string
  time: string
}

const activityColumns: ColumnsType<ActivityItem> = [
  { title: 'Action', dataIndex: 'action', key: 'action' },
  { title: 'User', dataIndex: 'user', key: 'user' },
  { title: 'Time', dataIndex: 'time', key: 'time' },
]

const activityData: ActivityItem[] = [
  { key: '1', action: 'Created monthly report', user: 'Alice', time: '2 mins ago' },
  { key: '2', action: 'Updated pricing plan', user: 'Mark', time: '12 mins ago' },
  { key: '3', action: 'Reviewed sales pipeline', user: 'Emma', time: '1 hour ago' },
  { key: '4', action: 'Exported revenue data', user: 'Lucas', time: '3 hours ago' },
]

function Dashboard() {
  return (
    <div className="sheet-page space-y-5">
      <div className="flex items-center justify-between border-b border-[#d8e4df] pb-4">
        <div>
          <Typography.Text className="text-xs font-semibold uppercase tracking-wide !text-[#5f736b]">
            Workbook / Dashboard
          </Typography.Text>
          <Typography.Title level={3} className="!m-0 !mt-1 !text-[#173f31]">
            Dashboard Overview
          </Typography.Title>
        </div>
        <div className="rounded border border-[#d8e4df] bg-[#f6faf8] px-3 py-2 text-sm text-[#51645c]">
          Total Records: {activityData.length}
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Users" value={1248} icon={<TeamOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Revenue" value={84520} suffix="$" icon={<DollarCircleOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Sales" value={432} icon={<ShoppingCartOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Growth" value={18.4} suffix="%" icon={<RiseOutlined />} />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card title="Performance Chart" className="sheet-card h-full">
            <div className="space-y-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Revenue target</span>
                  <span>78%</span>
                </div>
                <Progress percent={78} status="active" strokeColor="#2563eb" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Sales conversion</span>
                  <span>61%</span>
                </div>
                <Progress percent={61} strokeColor="#0ea5e9" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Customer retention</span>
                  <span>84%</span>
                </div>
                <Progress percent={84} strokeColor="#22c55e" />
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Recent Activity" className="sheet-card h-full">
            <Table<ActivityItem>
              className="grid-table"
              columns={activityColumns}
              dataSource={activityData}
              size="small"
              pagination={false}
              scroll={{ x: 'max-content' }}
              bordered
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

