import { Layout } from 'antd'
import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import HeaderBar from '../components/Header'
import Sidebar from '../components/Sidebar'

const { Header, Sider, Content } = Layout

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <Layout className="min-h-screen">
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        trigger={null}
        className="!fixed left-0 top-0 h-screen overflow-auto bg-white"
      >
        <Sidebar collapsed={collapsed} />
      </Sider>

      <Layout className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-[240px]'}`}>
        <Header className="sticky top-0 z-10 !h-14 !bg-transparent !p-0 !leading-none">
          <HeaderBar
            collapsed={collapsed}
            onToggle={() => setCollapsed((value) => !value)}
          />
        </Header>

        <Content className="sheet-canvas p-5">
          <div key={location.pathname} className="animate-fadeSlide">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
