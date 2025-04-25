"use client"

import { useState } from "react"
import type { User as AppUser } from "@/app/dashboard/page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BellIcon, Settings, LogOut, UserIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"
import EditProfileModal from "@/components/edit-profile-modal"

interface NavbarProps {
  currentUser?: AppUser
}

export default function Navbar({ currentUser }: NavbarProps) {
  const { user, profile, signOut } = useAuth()
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
  }

  // Use profile data if available, otherwise fallback to currentUser
  const displayName = profile?.name || currentUser?.name || user?.email?.split("@")[0] || "Usuario"
  const avatarUrl = profile?.avatar_url || currentUser?.avatar || "/placeholder.svg"

  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-mint text-white">
              <span className="text-lg font-bold">S</span>
            </div>
            <span className="text-xl font-bold dark:text-white">Splitly</span>
          </Link>

          <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-200 hidden sm:block">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditProfileOpen(true)}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Editar perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <EditProfileModal isOpen={editProfileOpen} onClose={() => setEditProfileOpen(false)} />
    </header>
  )
}
