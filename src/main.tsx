import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import 'antd/dist/reset.css'
import App from './App'
import { ThemeProvider } from './context/ThemeContext'
import type { LayoutMode, ThemeMode } from './context/ThemeContext'
import './index.css'

function Root() {
  const [mode, setMode] = useState<ThemeMode>('light')
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('vertical')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
  }, [mode])

  const themeValue = useMemo(
    () => ({ mode, setMode, layoutMode, setLayoutMode }),
    [mode, layoutMode],
  )

  return (
    <ThemeProvider value={themeValue}>
      <ConfigProvider
        theme={{
          algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: '#2563eb',
            borderRadius: 10,
            colorBgLayout: mode === 'dark' ? '#10161f' : '#f5f7fb',
          },
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
