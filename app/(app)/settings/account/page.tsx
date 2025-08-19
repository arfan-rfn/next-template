"use client"

import { useAuthContext } from "@/components/providers/auth-provider"
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
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useNotifications, useUpdateNotificationSetting } from "@/lib/hooks/use-notifications"
import { useDeleteAccount } from "@/lib/hooks/use-account"

export default function AccountSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  
  // TanStack Query hooks
  const { data: notifications, isLoading: loadingNotifications } = useNotifications()
  const updateNotificationSetting = useUpdateNotificationSetting()
  const deleteAccountMutation = useDeleteAccount()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router])

  const handleNotificationChange = (key: 'emailSecurity' | 'emailProduct' | 'emailMarketing', value: boolean) => {
    updateNotificationSetting(key, value)
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmation === "DELETE") {
      deleteAccountMutation.mutate({ confirmation: "DELETE" })
      setDeleteConfirmation("") // Reset the input
    }
  }

  const isDeleteConfirmed = deleteConfirmation === "DELETE"

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
                checked={notifications?.emailSecurity ?? true}
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
                checked={notifications?.emailProduct ?? true}
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
                checked={notifications?.emailMarketing ?? false}
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
            <AlertDialog onOpenChange={(open) => !open && setDeleteConfirmation("")}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="shrink-0"
                  disabled={deleteAccountMutation.isPending}
                >
                  <Icons.Trash className="size-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-4">
                      <div>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </div>
                      <div className="font-medium">
                        To confirm, this action will:
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Permanently delete your account</li>
                        <li>Remove all your personal data</li>
                        <li>Cancel any active subscriptions</li>
                        <li>Sign you out of all devices</li>
                      </ul>
                      <div className="space-y-2">
                        <div className="font-medium text-sm">
                          Type <span className="font-mono bg-muted px-1 py-0.5 rounded">DELETE</span> to confirm:
                        </div>
                        <Input
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="Type DELETE to confirm"
                          className="font-mono"
                          disabled={deleteAccountMutation.isPending}
                        />
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount} 
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deleteAccountMutation.isPending || !isDeleteConfirmed}
                  >
                    {deleteAccountMutation.isPending ? (
                      <>
                        <Icons.Loader2 className="size-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Icons.Trash className="size-4 mr-2" />
                        Delete Account
                      </>
                    )}
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