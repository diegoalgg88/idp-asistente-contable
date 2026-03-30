import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAppStore } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { useModulesStore } from '@/store/modules.store'

export default function Settings() {
  const { theme, setTheme } = useAppStore()
  const { user } = useAuth()
  const { updateUserProfile, updateUserSettings } = useModulesStore()

  const [profileName, setProfileName] = useState(user?.full_name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [settings, setSettings] = useState({
    language: 'es-MX',
    notifications: true,
    darkMode: theme === 'dark',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileName(user.full_name || '')
      setProfileEmail(user.email || '')
    }
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : value,
    }))

    if (name === 'darkMode') {
      setTheme((e.target as HTMLInputElement).checked ? 'dark' : 'light')
    }
  }

  const handleLanguageChange = (value: string) => {
    setSettings((prev) => ({ ...prev, language: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUserProfile({ full_name: profileName, email: profileEmail })
      await updateUserSettings({
        language: settings.language,
        notifications: settings.notifications,
        dark_mode: settings.darkMode,
      })
    } catch (e) {
      console.error('Error saving settings:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">
          Configura las preferencias de tu asistente
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Perfil</CardTitle>
            <CardDescription className="text-muted-foreground">
              Información de tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-foreground">Nombre</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Idioma</CardTitle>
            <CardDescription className="text-muted-foreground">
              Selecciona tu idioma preferido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={settings.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full bg-background border-border text-foreground">
                <SelectValue placeholder="Selecciona un idioma" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="es-MX">Español (México)</SelectItem>
                <SelectItem value="es-ES">Español (España)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Notificaciones</CardTitle>
            <CardDescription className="text-muted-foreground">
              Configura las notificaciones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications" className="text-foreground">Notificaciones de procesamiento</Label>
                <p className="text-sm text-muted-foreground">
                  Recibir notificaciones cuando se complete el procesamiento
                </p>
              </div>
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Apariencia</CardTitle>
            <CardDescription className="text-muted-foreground">
              Personaliza la apariencia de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="darkMode" className="text-foreground">Modo oscuro</Label>
                <p className="text-sm text-muted-foreground">
                  Cambiar entre modo claro y oscuro
                </p>
              </div>
              <input
                type="checkbox"
                id="darkMode"
                name="darkMode"
                checked={theme === 'dark'}
                onChange={(e) => {
                  const isDark = e.target.checked
                  setTheme(isDark ? 'dark' : 'light')
                  setSettings(prev => ({ ...prev, darkMode: isDark }))
                }}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  )
}
