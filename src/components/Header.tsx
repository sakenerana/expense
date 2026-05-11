import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Space, Tooltip, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { supabase, supabaseSession } from '../lib/supabase'

type HeaderBarProps = {
  collapsed: boolean
  onToggle: () => void
  showToggle?: boolean
}

function HeaderBar({ collapsed, onToggle, showToggle = true }: HeaderBarProps) {
  const navigate = useNavigate()
  const { mode } = useTheme()
  const [displayName, setDisplayName] = useState('Admin')

  useEffect(() => {
    const loadDisplayName = async () => {
      const [{ data: localUserData }, { data: sessionUserData }] = await Promise.all([
        supabase.auth.getUser(),
        supabaseSession.auth.getUser(),
      ])

      const userId = localUserData.user?.id ?? sessionUserData.user?.id
      const fallbackEmail = localUserData.user?.email ?? sessionUserData.user?.email

      if (!userId) {
        setDisplayName('Admin')
        return
      }

      const { data, error } = await supabase
        .from('Users')
        .select('first_name, middle_name, last_name')
        .eq('user_uuid', userId)
        .maybeSingle()

      if (error || !data) {
        setDisplayName(fallbackEmail || 'Admin')
        return
      }

      const firstName = data.first_name?.trim() ?? ''
      const middleName = data.middle_name?.trim() ?? ''
      const lastName = data.last_name?.trim() ?? ''
      const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim()

      setDisplayName(fullName || fallbackEmail || 'Admin')
    }

    void loadDisplayName()
  }, [])

  const handleLogout = async () => {
    const [{ error: localError }, { error: sessionError }] = await Promise.all([
      supabase.auth.signOut(),
      supabaseSession.auth.signOut()
    ])

    if (localError || sessionError) {
      message.error(localError?.message || sessionError?.message || 'Failed to logout.')
      return
    }

    localStorage.removeItem('supabase_access_token')
    localStorage.removeItem('supabase_refresh_token')
    message.success('Logged out successfully.')
    navigate('/login', { replace: true })
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
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded px-2 py-1">
          <Avatar size="small" className="bg-white/25" icon={<UserOutlined />} />
          <span className="text-sm text-white">{displayName}</span>
        </div>
        <Space size={6}>
          <Tooltip title="Settings">
            <Button
              type="text"
              icon={<SettingOutlined />}
              onClick={() => navigate('/settings')}
              className="!text-white hover:!bg-white/10"
            />
          </Tooltip>
          <Tooltip title="Logout">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={() => void handleLogout()}
              className="!text-white hover:!bg-white/10"
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  )
}

export default HeaderBar
