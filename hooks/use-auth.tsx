"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signUp: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; avatar_url?: string }) => Promise<{
    error: Error | null
    success: boolean
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, email, name, avatar_url")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data as UserProfile
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Error getting session:", error)
        setLoading(false)
        return
      }

      if (data?.session) {
        const { data: userData } = await supabase.auth.getUser()
        setUser(userData.user)

        // Fetch user profile
        if (userData.user) {
          const profileData = await fetchUserProfile(userData.user.id)
          setProfile(profileData)
        }
      }

      setLoading(false)

      // Handle redirects based on auth state
      handleAuthRedirects(!!data?.session)
    }

    getSession()

    // Listen for changes on auth state
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        const profileData = await fetchUserProfile(session.user.id)
        setProfile(profileData)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)

      // Handle redirects based on auth state
      handleAuthRedirects(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [pathname, router])

  // Handle redirects based on auth state
  const handleAuthRedirects = (isAuthenticated: boolean) => {
    // Skip redirects during initial loading
    if (loading) return

    // If authenticated and trying to access login/register pages
    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      router.push("/dashboard")
    }

    // If not authenticated and trying to access dashboard
    if (!isAuthenticated && pathname?.startsWith("/dashboard")) {
      router.push("/login")
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error, success: false }
      }

      // Auto sign in after sign up
      return await signIn(email, password)
    } catch (error) {
      return { error: error as Error, success: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error, success: false }
      }

      toast({
        title: "Inicio de sesión exitoso",
        description: "Has iniciado sesión correctamente.",
      })

      router.push("/dashboard")
      return { error: null, success: true }
    } catch (error) {
      return { error: error as Error, success: false }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })
    router.push("/")
  }

  const updateProfile = async (data: { name?: string; avatar_url?: string }) => {
    if (!user) {
      return { error: new Error("No user logged in"), success: false }
    }

    try {
      const { error } = await supabase.from("users").update(data).eq("id", user.id)

      if (error) {
        return { error, success: false }
      }

      // Update local profile state
      setProfile((prev) => (prev ? { ...prev, ...data } : null))

      toast({
        title: "Perfil actualizado",
        description: "Tu perfil ha sido actualizado correctamente.",
      })

      return { error: null, success: true }
    } catch (error) {
      return { error: error as Error, success: false }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
