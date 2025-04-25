"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { profile, updateProfile } = useAuth()
  const [name, setName] = useState(profile?.name || "")
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatar(file)
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const updates: { name?: string; avatar_url?: string } = {}

      // Update name if changed
      if (name !== profile?.name) {
        updates.name = name
      }

      // Upload avatar if selected
      if (avatar) {
        const fileName = `avatar-${Date.now()}-${avatar.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatar)

        if (uploadError) {
          throw new Error(`Error uploading avatar: ${uploadError.message}`)
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName)
        updates.avatar_url = publicUrlData.publicUrl
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await updateProfile(updates)
        if (updateError) {
          throw updateError
        }
      }

      onClose()
    } catch (err) {
      console.error("Error updating profile:", err)
      setError(err instanceof Error ? err.message : "Error updating profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={avatarPreview || "/placeholder.svg"}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} className="flex-1" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sube una imagen para tu perfil (opcional)</p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-mint hover:bg-mint/90 text-white dark:hover:bg-mint/80"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
