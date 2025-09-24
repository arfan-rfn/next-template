"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"
import { useAuth } from "@/lib/hooks/use-auth"
import { useUpdateProfile } from "@/lib/hooks/use-account"

interface ProfileEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface ProfileFormData {
  name: string
  bio: string
  image?: string
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  const router = useRouter()
  const { user, refresh } = useAuth()
  const updateProfileMutation = useUpdateProfile()
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    bio: "", // Add bio field to user data later
    image: user?.image || undefined
  })

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // Create local preview URL for the selected image
      const imageUrl = URL.createObjectURL(file)
      setFormData(prev => ({ ...prev, image: imageUrl }))
    } catch (error) {
      console.error("Failed to process image:", error)
    }
  }

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({
        name: formData.name,
        bio: formData.bio,
        image: formData.image,
        profileCompleted: true
      })
      
      // Refresh user data
      await refresh()
      
      // Close dialog and navigate back to dashboard
      onOpenChange(false)
      router.push('/dashboard')
    } catch (error) {
      console.error("Failed to update profile:", error)
      // Error is already handled by the mutation hook with toast
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    router.push('/dashboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information and settings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.image} alt={formData.name} />
              <AvatarFallback className="bg-muted text-lg">
                <Icons.User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Icons.Edit className="mr-2 h-4 w-4" />
                    Change Picture
                  </span>
                </Button>
              </Label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
              <p className="text-xs text-muted-foreground text-center">
                Upload a new profile picture (JPG, PNG)
              </p>
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field (readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email address cannot be changed
            </p>
          </div>

          {/* Bio Field */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Brief description for your profile
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={updateProfileMutation.isPending}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending}
            className="w-full sm:w-auto"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Icons.Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Icons.Check className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}