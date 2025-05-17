"use client"

import { useTheme } from "@/providers/ThemeProvider"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"

type ThemeToggleProps = {
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ showLabel = false, className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can show the theme toggle
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a placeholder with the same dimensions to prevent layout shift
    return <div className={`h-10 w-10 ${className}`} />
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("oled")
    else setTheme("light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Change theme, current theme: ${theme}`}
      className={`theme-toggle-button relative ${className}`}
    >
      <div className="relative h-5 w-5">
        {/* Sun icon for light mode */}
        <Sun 
          className={`h-5 w-5 transition-all ${
            theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } absolute`}
        />
        
        {/* Moon icon for dark mode */}
        <Moon 
          className={`h-5 w-5 transition-all ${
            theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } absolute`}
        />
        
        {/* Monitor icon for OLED mode */}
        <Monitor 
          className={`h-5 w-5 transition-all ${
            theme === "oled" ? "scale-100 opacity-100" : "scale-0 opacity-0"
          } absolute`}
        />

        {showLabel && (
          <span className="ml-2 relative top-0 text-sm">
            {theme.charAt(0).toUpperCase() + theme.slice(1)}
          </span>
        )}
      </div>
    </Button>
  )
}
