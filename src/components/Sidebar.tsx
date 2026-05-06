import {
  AppstoreOutlined,
  BarsOutlined,
  BarChartOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  ShopOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

type SidebarProps = {
  collapsed: boolean
}

const items: MenuProps['items'] = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
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

function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="h-full border-r border-[#d7e2df] bg-[#fbfdfc] pt-4">
      <div className={`px-4 pb-4 ${collapsed ? 'text-center' : ''}`}>
        <div className="rounded border border-[#d9e5df] bg-white px-3 py-3 shadow-sm">
          <p
            className={`m-0 text-xs font-semibold uppercase tracking-wide text-[#587066] ${
              collapsed ? 'hidden' : 'block'
            }`}
          >
            Spend Management
          </p>
          <p
            className={`m-0 text-sm font-bold text-[#173f31] ${
              collapsed ? 'hidden' : 'block'
            }`}
          >
            Platform
          </p>
          <p className={`m-0 text-xs font-bold text-[#173f31] ${collapsed ? 'block' : 'hidden'}`}>
            SMP
          </p>
        </div>
      </div>
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]}
        items={items}
        onClick={({ key }) => navigate(key)}
        inlineCollapsed={collapsed}
      />
    </div>
  )
}

export default Sidebar
