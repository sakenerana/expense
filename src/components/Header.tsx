import {
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'

const userItems: MenuProps['items'] = [
  { key: '1', label: 'Profile' },
  { key: '2', label: 'Settings' },
  { key: '3', label: 'Logout' },
]

type HeaderBarProps = {
  collapsed: boolean
  onToggle: () => void
}

function HeaderBar({ collapsed, onToggle }: HeaderBarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-[#154734] bg-[#1f6f50] px-4 text-white shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          aria-label="Toggle sidebar"
          className="!text-white hover:!bg-white/10"
        />
        <Typography.Title level={4} className="!m-0 !text-white">
          Spend Management Workbook
        </Typography.Title>
      </div>
      <Dropdown menu={{ items: userItems }} trigger={['click']}>
        <button className="flex items-center gap-2 rounded border-none bg-transparent px-2 py-1 text-white transition hover:bg-white/10">
          <Avatar size="small" className="bg-white/25" icon={<UserOutlined />} />
          <Space>
            <span className="text-sm text-white">Admin</span>
            <DownOutlined className="text-xs" />
          </Space>
        </button>
      </Dropdown>
    </div>
  )
}

export default HeaderBar
