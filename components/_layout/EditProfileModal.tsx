"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PenSquare } from "lucide-react"
import { toast } from "sonner"

interface UserData {
  id: number
  username: string
  about: string
  wallet_address: string
  profile_pic: string
  playmoney: number
  createdAt: string
  updatedAt: string
}

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("No access token found")
        toast.error("Authentication error. Please log in again.")
        return
      }

      try {
        // Use wallet address instead of username to fetch user data
        const walletAddress = localStorage.getItem("walletAddress")
        if (!walletAddress) {
          throw new Error("No wallet address found in localStorage")
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}users?wallet_address=${walletAddress}&limit=10&page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        console.log("received data : ", data)
        if (data && data.length > 0) {
          const userData = data[0]
          setUserData(userData)
          // Preserve the current username from localStorage
          const storedUsername = localStorage.getItem("username") || userData.username
          setUsername(storedUsername)
          setBio(userData.about || "")
          setUploadedImageUrl(userData.profile_pic || "")
        } else {
          throw new Error("No user data found")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user data")
      }
    }

    if (isOpen) {
      fetchUserData()
    }
  }, [isOpen])

  const uploadImage = async (accessToken: string, image: File) => {
    const formData = new FormData()
    formData.append("image", image)
    formData.append("type", "events")

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Failed to upload image")
    }

    const data = await response.json()
    return data.url
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        throw new Error("No access token found")
      }
      console.log("access token recieved : ", accessToken)

      const updatedData: { username?: string; about?: string; profile_pic?: string } = {}

      if (username !== userData?.username) updatedData.username = username
      if (bio !== userData?.about) updatedData.about = bio
      if (uploadedImageUrl !== userData?.profile_pic && uploadedImageUrl !== "")
        updatedData.profile_pic = uploadedImageUrl

      if (Object.keys(updatedData).length === 0) {
        toast.info("No changes to save")
        onClose()
        return
      }
      console.log("updated Data : ", updatedData)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update localStorage with the new username
      if (updatedData.username) {
        localStorage.setItem("username", updatedData.username)
      }

      toast.success("Profile updated successfully")
      onClose()
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsLoading(true)
      try {
        const file = e.target.files[0]
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          throw new Error("No access token found")
        }

        const imageUrl = await uploadImage(accessToken, file)
        setProfilePhoto(file)
        setUploadedImageUrl(imageUrl)
        toast.success("Image uploaded successfully")
      } catch (error) {
        console.error("Error uploading image:", error)
        toast.error("Failed to upload image")
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px] bg-[#1F1F2F] dm-sans border-none text-ow1">
        <DialogHeader>
          <DialogTitle className="text-lg font-normal text-center text-ow1">Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-4">
          <div className="flex items-center justify-between">
            <label htmlFor="profile-photo" className="text-base font-normal text-ow1">
              Profile photo
            </label>
            <div className="relative w-12 h-12 -translate-x-[16.5rem] bg-[#8B9AFF] rounded-sm group cursor-pointer">
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              {profilePhoto ? (
                <img
                  src={URL.createObjectURL(profilePhoto) || "/placeholder.svg"}
                  alt="Profile preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                />
              ) : uploadedImageUrl ? (
                <>
                  <div className="relative w-full h-full">
                    <img
                      src={uploadedImageUrl || "/placeholder.svg"}
                      alt="Current profile"
                      className="absolute inset-0 w-full h-full object-cover rounded-sm"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 75%, 75% 75%, 75% 100%, 0 100%)",
                      }}
                    />
                    <div className="absolute bottom-0 bg-[#151621] right-0 p-1">
                      <PenSquare className="w-4 h-4 text-[#FF6B2C]" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute bottom-0 right-0 p-1">
                  <PenSquare className="w-4 h-4 text-[#FF6B2C]" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="username" className="text-base font-normal text-ow1 w-1/3">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#151621] border-none text-ow1 h-8 w-2/3"
              placeholder="Enter username"
            />
          </div>

          <div className="flex items-start justify-between">
            <label htmlFor="bio" className="text-base font-normal text-ow1 w-1/3 pt-3">
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-[#151621] border-none text-ow1 min-h-[20px] resize-none w-2/3"
              placeholder="Tell us about yourself"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-[#EC762E] hover:bg-[#ff8533] text-darkbg2 mt-4"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal

