"use client"

import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import { Icons } from "@/components/icons"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface NotificationSettings {
  emailMarketing: boolean
  emailSecurity: boolean
  emailProduct: boolean
}

export default function AccountSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMarketing: false,
    emailSecurity: true,
    emailProduct: true,
  })
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadNotificationSettings()
    }
  }, [isAuthenticated])

  const loadNotificationSettings = async () => {
    try {
      // Replace with your actual backend API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notifications`, {
        credentials: 'include', // Include cookies for authentication
      })
      if (!response.ok) {
        throw new Error("Failed to fetch notification settings")
      }
      const data = await response.json()
      setNotifications({
        emailMarketing: data.preferences.emailMarketing,
        emailSecurity: data.preferences.emailSecurity,
        emailProduct: data.preferences.emailProduct,
      })
    } catch (error) {
      console.error("Failed to load notification settings:", error)
      toast.error("Failed to load notification preferences")
    }
  }

  const handleNotificationChange = async (key: keyof NotificationSettings, value: boolean) => {
    try {
      setLoadingNotifications(true)
      const updatedNotifications = { ...notifications, [key]: value }
      setNotifications(updatedNotifications)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/notifications`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          preferences: updatedNotifications
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update notifications")
      }
      
      toast.success("Notification preferences updated")
    } catch (error) {
      console.error("Failed to update notifications:", error)
      toast.error("Failed to update notification preferences")
      // Revert the change on error
      setNotifications(prev => ({ ...prev, [key]: !value }))
    } finally {
      setLoadingNotifications(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          confirmation: true
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to request account deletion")
      }
      
      const data = await response.json()
      toast.success(data.message)
    } catch (error) {
      console.error("Failed to request account deletion:", error)
      toast.error("Failed to request account deletion")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.User className="size-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            View and manage your account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{user?.name || 'Not provided'}</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Update Profile</h4>
                <p className="text-sm text-muted-foreground">
                  Change your name and other profile information
                </p>
              </div>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Shield className="size-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Password</h4>
                <p className="text-sm text-muted-foreground">
                  Last changed 3 months ago
                </p>
              </div>
              <Button variant="outline">Change Password</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Login Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified of new sign-ins to your account
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Bell className="size-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose which emails you&apos;d like to receive from us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Security Alerts</h4>
                <p className="text-sm text-muted-foreground">
                  Important security updates and notifications
                </p>
              </div>
              <Switch 
                checked={notifications.emailSecurity}
                onCheckedChange={(checked) => handleNotificationChange('emailSecurity', checked)}
                disabled={loadingNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Product Updates</h4>
                <p className="text-sm text-muted-foreground">
                  New features and product announcements
                </p>
              </div>
              <Switch 
                checked={notifications.emailProduct}
                onCheckedChange={(checked) => handleNotificationChange('emailProduct', checked)}
                disabled={loadingNotifications}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">Marketing Emails</h4>
                <p className="text-sm text-muted-foreground">
                  Tips, tutorials, and promotional content
                </p>
              </div>
              <Switch 
                checked={notifications.emailMarketing}
                onCheckedChange={(checked) => handleNotificationChange('emailMarketing', checked)}
                disabled={loadingNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Icons.Warning className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            These actions cannot be undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="shrink-0">
                  <Icons.Trash className="size-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers. You will receive
                    an email with instructions to confirm this deletion.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Request Account Deletion
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}