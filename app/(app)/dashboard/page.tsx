"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Icons } from "@/components/icons"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router, isLoading])

  return (
    <div className="min-h-screen p-4">
      <div className="w-full max-w-md mx-auto pt-20">
        <div className="text-center space-y-8">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={user?.image || undefined} alt={user?.name || user?.email} />
            <AvatarFallback className="bg-muted">
              <Icons.User className="w-10 h-10 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">
              {user?.name || 'Welcome'}
            </h1>
            <p className="text-muted-foreground">
              {user?.email}
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => router.push('/settings/profile')}
              className="flex-1 max-w-[150px]"
            >
              <Icons.Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              onClick={() => router.push('/settings')}
              variant="outline"
              className="flex-1 max-w-[150px]"
            >
              <Icons.Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}