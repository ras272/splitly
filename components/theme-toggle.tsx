"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 relative overflow-hidden rounded-full"
    >
      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out dark:-rotate-90 dark:scale-0">
        <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-in-out rotate-90 scale-0 dark:rotate-0 dark:scale-100">
        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
