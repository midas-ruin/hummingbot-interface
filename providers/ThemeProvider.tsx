"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "oled" | "system"
type AccessibilitySettings = {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
}

type ThemeContextType = {
  theme: Theme
  accessibilitySettings: AccessibilitySettings
  setTheme: (theme: Theme) => void
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "oled", // OLED as default
  ...props
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [mounted, setMounted] = useState(false)
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(defaultSettings)
  
  // For SSR - only render after mounted on client
  useEffect(() => {
    setMounted(true)
    
    // Load accessibility settings from localStorage
    try {
      const storedSettings = localStorage.getItem("accessibility-settings")
      if (storedSettings) {
        setAccessibilitySettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      console.error("Failed to load accessibility settings:", error)
    }
  }, [])
  
  // Update HTML attributes when accessibility settings change
  useEffect(() => {
    if (!mounted) return
    
    document.documentElement.setAttribute("data-high-contrast", 
      accessibilitySettings.highContrast ? "true" : "false")
    
    document.documentElement.setAttribute("data-large-text", 
      accessibilitySettings.largeText ? "true" : "false")
    
    document.documentElement.setAttribute("data-reduced-motion", 
      accessibilitySettings.reducedMotion ? "true" : "false")
    
    // Save settings to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(accessibilitySettings))
  }, [accessibilitySettings, mounted])
  
  // Update accessibility settings
  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      ...settings
    }))
  }
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      enableColorScheme
      themes={["light", "dark", "oled"]}
      {...props}
    >
      <ThemeContext.Provider
        value={{
          theme: "oled" as Theme, // This will be overridden by next-themes
          accessibilitySettings,
          setTheme: () => {}, // This will be overridden by next-themes
          updateAccessibility,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  const { setTheme, theme } = NextThemesProvider.useContext()
  
  return {
    ...context,
    theme,
    setTheme,
  }
}
