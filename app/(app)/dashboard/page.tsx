"use client"

import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { useAuth } from "@/lib/hooks/use-auth"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, signOut, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, router, isLoading])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      router.push("/auth/sign-in")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("Failed to sign out")
    }
  }

  return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome back, {user?.email || "User"}!
              </p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>

          <div className="p-6 bg-card rounded-lg border">
            <pre className="whitespace-pre-wrap break-words text-background">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

        </div>
      </div>

  )
}