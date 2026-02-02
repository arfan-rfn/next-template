"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { ProfileSkeleton } from "@/components/ui/skeletons"

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
  const [hasMounted, setHasMounted] = useState(false)

  // Track when component has mounted to avoid hydration mismatch
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted && !isLoading && !isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router, isLoading, hasMounted])

  // Show skeleton during SSR and initial hydration to ensure consistency
  // This prevents hydration mismatch by rendering the same content on server and client
  if (!hasMounted || isLoading) {
    return <ProfileSkeleton />
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