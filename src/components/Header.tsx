import {
  DownOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Dropdown, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const userItems: MenuProps['items'] = [
  { key: '1', label: 'Settings', icon: <SettingOutlined /> },
  { key: '2', label: 'Logout', icon: <LogoutOutlined /> },
]

type HeaderBarProps = {
  collapsed: boolean
  onToggle: () => void
  showToggle?: boolean
}

function HeaderBar({ collapsed, onToggle, showToggle = true }: HeaderBarProps) {
  const navigate = useNavigate()
  const { mode } = useTheme()

  const onUserMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      navigate('/settings')
    }
  }

  return (
    <div
      className={`flex h-14 items-center justify-between px-4 text-white shadow-sm ${
        mode === 'dark'
          ? 'border-b border-[#223447] bg-[#152230]'
          : 'border-b border-[#154734] bg-[#1f6f50]'
      }`}
    >
      <div className="flex items-center gap-3">
        {showToggle && (
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="!text-white hover:!bg-white/10"
          />
        )}
        <Typography.Title level={4} className="!m-0 !text-white">
          Spend Management Workbook
        </Typography.Title>
      </div>
      <Dropdown menu={{ items: userItems, onClick: onUserMenuClick }} trigger={['click']}>
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
