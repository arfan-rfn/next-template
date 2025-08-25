"use client"

import { useAuthContext } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
import { useDeleteAccount } from "@/lib/hooks/use-account"
import { authClient } from "@/lib/auth"

export default function AccountSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  
  // TanStack Query hooks
  const deleteAccountMutation = useDeleteAccount()

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router])

  const handleDeleteAccount = () => {
    if (deleteConfirmation === "DELETE") {
      deleteAccountMutation.mutate({ confirmation: "DELETE" })
      setDeleteConfirmation("") // Reset the input
    }
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/auth/sign-in")
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
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.User className="size-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and identifiers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Icons.User className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.name || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icons.Mail className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icons.Calendar className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium">Account Created</p>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }) : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <Icons.Key className="size-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <p className="text-sm font-medium">Account ID</p>
                  <p className="text-sm text-muted-foreground font-mono break-all">{user?.id}</p>
                </div>
              </div>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">
                Sign out of your account on this device
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="shrink-0 w-full sm:w-auto"
            >
              <Icons.LogOut className="size-4 mr-2" />
              Sign Out
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1 min-w-0 flex-1">
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </p>
            </div>
            <AlertDialog onOpenChange={(open) => !open && setDeleteConfirmation("")}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="shrink-0 w-full sm:w-auto"
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