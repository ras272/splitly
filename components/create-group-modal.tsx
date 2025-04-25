"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CreateGroupModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateGroup: (name: string) => Promise<void>
}

export default function CreateGroupModal({ isOpen, onClose, onCreateGroup }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!groupName.trim()) {
      setError("El nombre del grupo es obligatorio")
      return
    }

    try {
      setLoading(true)
      setError(null)
      await onCreateGroup(groupName.trim())

      // Reset form
      setGroupName("")

      // Close modal
      onClose()
    } catch (err) {
      console.error("Error creating group:", err)
      setError("Ocurrió un error al crear el grupo. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear nuevo grupo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="groupName">Nombre del grupo</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="ej., Apartamento 304"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Crea un grupo para compartir gastos con amigos, compañeros de piso o familia.
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-mint hover:bg-mint/90 text-white dark:hover:bg-mint/80"
              disabled={loading || !groupName.trim()}
            >
              {loading ? "Creando..." : "Crear grupo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
