"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Icons } from "@/components/icons"

interface DashboardLayoutProps {
  children: ReactNode
  profileModal: ReactNode
  welcomeModal: ReactNode
}

export default function DashboardLayout({
  children,
  profileModal,
  welcomeModal,
}: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router, isLoading])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Icons.Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render dashboard content for unauthenticated users
  if (!isAuthenticated) {
    return null
  }

  return (
    <div>
      {children}
      {profileModal}
      {welcomeModal}
    </div>
  )
}