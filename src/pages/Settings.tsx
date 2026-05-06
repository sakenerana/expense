import { Card, Switch, Typography } from 'antd'
import { useTheme } from '../context/ThemeContext'

function Settings() {
  const { mode, setMode, layoutMode, setLayoutMode } = useTheme()

  return (
    <div className="sheet-page max-w-3xl">
      <Typography.Title level={3} className={`!mb-2 ${mode === 'dark' ? '!text-[#e2ecf7]' : '!text-[#173f31]'}`}>
        Settings
      </Typography.Title>
      <Typography.Paragraph className={`!mb-6 ${mode === 'dark' ? '!text-[#9eb0c2]' : '!text-gray-500'}`}>
        Manage your account preferences.
      </Typography.Paragraph>

      <Card className="sheet-card">
        <div className="flex items-center justify-between">
          <div>
            <Typography.Text strong>Theme Mode</Typography.Text>
            <Typography.Paragraph className={`!mb-0 !mt-1 ${mode === 'dark' ? '!text-[#9eb0c2]' : '!text-gray-500'}`}>
              Switch between light and dark mode.
            </Typography.Paragraph>
          </div>
          <Switch
            checked={mode === 'dark'}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            onChange={(checked) => setMode(checked ? 'dark' : 'light')}
          />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-[#d8e4df] pt-5">
          <div>
            <Typography.Text strong>Navigation Layout</Typography.Text>
            <Typography.Paragraph className={`!mb-0 !mt-1 ${mode === 'dark' ? '!text-[#9eb0c2]' : '!text-gray-500'}`}>
              Use left sidebar or top horizontal navigation.
            </Typography.Paragraph>
          </div>
          <Switch
            checked={layoutMode === 'horizontal'}
            checkedChildren="Horizontal"
            unCheckedChildren="Sidebar"
            onChange={(checked) => setLayoutMode(checked ? 'horizontal' : 'vertical')}
          />
        </div>
      </Card>
    </div>
  )
}

export default Settings
