import {
  AppstoreOutlined,
  BarsOutlined,
  BarChartOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  ShopOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

type SidebarProps = {
  collapsed?: boolean
  orientation?: 'vertical' | 'horizontal'
}

const items: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
  },
  {
    key: '/users',
    icon: <TeamOutlined />,
    label: 'Users',
  },
  {
    key: '/supplier',
    icon: <ShopOutlined />,
    label: 'Supplier',
  },
  {
    key: '/operation-type',
    icon: <BarsOutlined />,
    label: 'Operation Type',
  },
  {
    key: '/expense-type',
    icon: <AppstoreOutlined />,
    label: 'Expense Type',
  },
  {
    key: '/disbursement',
    icon: <CarryOutOutlined />,
    label: 'Disbursement',
  },
  {
    key: '/reports',
    icon: <BarChartOutlined />,
    label: 'Reports',
  },
]

function Sidebar({ collapsed = false, orientation = 'vertical' }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode } = useTheme()

  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={`${isHorizontal ? 'px-4' : 'h-full pt-4'} ${
        mode === 'dark'
          ? `${isHorizontal ? 'border-b border-[#223447]' : 'border-r border-[#223447]'} bg-[#0f1720]`
          : `${isHorizontal ? 'border-b border-[#d7e2df]' : 'border-r border-[#d7e2df]'} bg-[#fbfdfc]`
      }`}
    >
      {!isHorizontal && (
      <div className={`px-4 pb-4 ${collapsed ? 'text-center' : ''}`}>
        <div
          className={`rounded px-3 py-3 shadow-sm ${
            mode === 'dark'
              ? 'border border-[#2c3e50] bg-[#152230]'
              : 'border border-[#d9e5df] bg-white'
          }`}
        >
          <p
            className={`m-0 text-xs font-semibold uppercase tracking-wide ${
              mode === 'dark' ? 'text-[#8fa8bc]' : 'text-[#587066]'
            } ${
              collapsed ? 'hidden' : 'block'
            }`}
          >
            Spend Management
          </p>
          <p
            className={`m-0 text-sm font-bold ${
              mode === 'dark' ? 'text-[#e2ecf7]' : 'text-[#173f31]'
            } ${
              collapsed ? 'hidden' : 'block'
            }`}
          >
            Platform
          </p>
          <p
            className={`m-0 text-xs font-bold ${
              mode === 'dark' ? 'text-[#e2ecf7]' : 'text-[#173f31]'
            } ${collapsed ? 'block' : 'hidden'}`}
          >
            SMP
          </p>
        </div>
      </div>
      )}
      <Menu
        mode={isHorizontal ? 'horizontal' : 'inline'}
        theme={mode === 'dark' ? 'dark' : 'light'}
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        inlineCollapsed={!isHorizontal ? collapsed : undefined}
        className={isHorizontal ? 'top-nav-menu' : undefined}
      />
    </div>
  )
}

export default Sidebar
