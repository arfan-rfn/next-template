"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useAuth } from "@/lib/hooks/use-auth"

interface WelcomeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleCompleteProfile = () => {
    setIsLoading(true)
    router.push('/dashboard/edit')
    setIsLoading(false)
  }

  const handleSkipForNow = () => {
    onOpenChange(false)
    router.push('/dashboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icons.User className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-xl">Welcome to the app!</DialogTitle>
          <DialogDescription>
            Hi {user?.name || 'there'}! We&apos;re excited to have you here. Let&apos;s get your profile set up so you can make the most of your experience.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Icons.Check className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Account created</p>
                <p className="text-muted-foreground">Your account is ready to go</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Icons.Edit className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Complete your profile</p>
                <p className="text-muted-foreground">Add your details and profile picture</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                <Icons.Settings className="h-4 w-4 text-gray-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Explore the features</p>
                <p className="text-muted-foreground">Discover everything you can do</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleSkipForNow}
            className="w-full sm:w-auto"
          >
            Skip for now
          </Button>
          <Button
            onClick={handleCompleteProfile}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Icons.Edit className="mr-2 h-4 w-4" />
                Complete Profile
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}