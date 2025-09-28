"use client"

import { useEffect, useState } from "react"
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
import { useFileUpload } from "@/lib/hooks/use-file-upload"
import { toast } from "sonner"

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
  const { user, refresh, isLoading } = useAuth()
  const updateProfileMutation = useUpdateProfile()
  const { uploadFile, isUploading, progress, error: uploadError, resetUpload } = useFileUpload()
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || "",
    bio: "", // Add bio field to user data later
    image: user?.image || undefined
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('Image must be smaller than 10MB')
      return
    }

    try {
      // Reset any previous upload state
      resetUpload()

      // Create local preview URL for immediate display
      const imageUrl = URL.createObjectURL(file)
      setSelectedFile(file)
      setPreviewUrl(imageUrl)

      // Store the preview in formData temporarily
      setFormData(prev => ({ ...prev, image: imageUrl }))

    } catch (error) {
      console.error("Failed to process image:", error)
      toast.error('Failed to process image')
    }
  }

  const handleSave = async () => {
    try {
      let imageUrl = formData.image

      // If there's a selected file, upload it first
      if (selectedFile) {
        const uploadedFile = await uploadFile(selectedFile, {
          visibility: 'public',
          generatePublicUrl: true,
        })

        if (!uploadedFile) {
          throw new Error('Failed to upload image')
        }

        imageUrl = uploadedFile.publicUrl || uploadedFile.url

        // Clean up the preview URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
          setPreviewUrl(null)
        }
      }

      await updateProfileMutation.mutateAsync({
        name: formData.name,
        bio: formData.bio,
        image: imageUrl,
        profileCompleted: true
      })

      // Refresh user data
      await refresh()

      // Reset file upload state
      setSelectedFile(null)
      resetUpload()

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

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        image: user.image || undefined
      })
    }
  }, [user])

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
              <Label htmlFor="image-upload" className={isUploading ? "cursor-not-allowed" : "cursor-pointer"}>
                <Button variant="outline" size="sm" asChild disabled={isUploading}>
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
                disabled={isUploading}
                className="sr-only"
              />
              {isUploading && (
                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <Icons.Loader className="h-3 w-3 animate-spin" />
                    <span>Uploading... {progress}%</span>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-1">
                    <div
                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              {uploadError && (
                <p className="text-xs text-red-600 text-center">{uploadError}</p>
              )}
              {!isUploading && !uploadError && (
                <p className="text-xs text-muted-foreground text-center">
                  Upload a new profile picture (JPG, PNG, max 10MB)
                </p>
              )}
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
            disabled={updateProfileMutation.isPending || isUploading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateProfileMutation.isPending || isUploading}
            className="w-full sm:w-auto"
          >
            {(updateProfileMutation.isPending || isUploading) ? (
              <>
                <Icons.Loader className="mr-2 h-4 w-4 animate-spin" />
                {isUploading ? `Uploading... ${progress}%` : 'Saving...'}
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