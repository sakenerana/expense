import { createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark'
export type LayoutMode = 'vertical' | 'horizontal'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  layoutMode: LayoutMode
  setLayoutMode: (mode: LayoutMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({
  value,
  children,
}: {
  value: ThemeContextValue
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }

  return context
}
