"use client"

import { useAuthContext } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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

interface DeviceSession {
  id: string
  userId: string
  userAgent: string
  ipAddress: string
  location?: string
  createdAt: string
  lastAccessed: string
  isCurrent: boolean
  deviceType: string
  browser: string
}

export default function DeviceSettingsPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()
  const router = useRouter()
  const [sessions, setSessions] = useState<DeviceSession[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions()
    }
  }, [isAuthenticated])

  const loadSessions = async () => {
    try {
      setLoadingSessions(true)
      // Replace with your actual backend API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/session`, {
        credentials: 'include',
      })
      if (!response.ok) {
        throw new Error("Failed to fetch sessions")
      }
      const data = await response.json()
      console.log(data)
      if (data.sessions) {
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error("Failed to load sessions:", error)
      toast.error("Failed to load device sessions")
    } finally {
      setLoadingSessions(false)
    }
  }

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/session/${sessionId}`, {
        method: "DELETE",
        credentials: 'include', // Include cookies for authentication
      })
      if (!response.ok) {
        throw new Error("Failed to revoke session")
      }
      setSessions(sessions.filter(s => s.id !== sessionId))
      toast.success("Device session revoked successfully")
    } catch (error) {
      console.error("Failed to revoke session:", error)
      toast.error("Failed to revoke session")
    }
  }

  const handleRevokeAllOtherSessions = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/session`, {
        method: "DELETE",
        credentials: 'include', // Include cookies for authentication
      })
      if (!response.ok) {
        throw new Error("Failed to revoke other sessions")
      }
      setSessions(sessions.filter(s => s.isCurrent))
      toast.success("All other sessions revoked successfully")
    } catch (error) {
      console.error("Failed to revoke other sessions:", error)
      toast.error("Failed to revoke other sessions")
    }
  }

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes("iPhone") || userAgent.includes("Android")) {
      return Icons.Smartphone
    }
    return Icons.Monitor
  }

  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
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
      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Monitor className="size-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage devices that are currently signed into your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSessions ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {sessions.map((session) => {
                  const DeviceIcon = getDeviceIcon(session.userAgent)
                  return (
                    <div key={session.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <DeviceIcon className="size-8 text-muted-foreground mt-1" />
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {session.userAgent.includes("iPhone") ? "iPhone" :
                             session.userAgent.includes("Android") ? "Android Device" :
                             "Desktop Browser"}
                          </h4>
                          {session.isCurrent && (
                            <Badge variant="secondary" className="text-xs">
                              Current Session
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Icons.Clock className="size-3" />
                            Last active: {formatLastAccessed(session.lastAccessed)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Icons.Location className="size-3" />
                            {session.location} • {session.ipAddress}
                          </div>
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Revoke
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Session</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will sign out this device from your account.
                                The user will need to sign in again to access your account.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleRevokeSession(session.id)}>
                                Revoke Session
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-medium">Sign out all other devices</h4>
                  <p className="text-sm text-muted-foreground">
                    This will sign out all devices except this one
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">
                      Sign Out All Others
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sign Out All Other Devices</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will sign out all devices except the current one.
                        You will need to sign in again on those devices.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRevokeAllOtherSessions}>
                        Sign Out All Others
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Device Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icons.Shield className="size-5" />
            Device Security
          </CardTitle>
          <CardDescription>
            Keep your account secure across all devices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Icons.Check className="size-4 text-green-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Regular monitoring</p>
                <p className="text-xs text-muted-foreground">
                  Regularly review your active sessions and revoke any you don&apos;t recognize
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icons.Check className="size-4 text-green-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Secure networks</p>
                <p className="text-xs text-muted-foreground">
                  Always use secure, trusted networks when accessing your account
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Icons.Check className="size-4 text-green-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Sign out when done</p>
                <p className="text-xs text-muted-foreground">
                  Sign out from shared or public devices when you&apos;re finished
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}