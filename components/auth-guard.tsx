"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading) {
      // If the user is not authenticated and trying to access a protected route
      if (!user && pathname?.startsWith("/dashboard")) {
        router.push("/login")
      }

      // If the user is authenticated and trying to access login page
      if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, pathname, router, isClient])

  // Show loading or nothing while checking auth
  if (loading || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mint mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
