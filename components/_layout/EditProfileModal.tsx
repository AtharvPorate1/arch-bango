'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PenSquare } from 'lucide-react'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  username?: string
  bio?: string
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  username: initialUsername = "", 
  bio: initialBio = "" 
}) => {
  const [username, setUsername] = useState(initialUsername)
  const [bio, setBio] = useState(initialBio)
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)

  const handleSave = async () => {
    // Here you would typically handle the save operation
    onClose()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#1F1F2F] border-none text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal text-center text-white">Edit profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center justify-between">
            <label htmlFor="profile-photo" className="text-base font-normal text-white">Profile photo</label>
            <div className="relative w-20 h-20 bg-[#8B9AFF] rounded-sm group cursor-pointer">
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {profilePhoto ? (
                <img
                  src={URL.createObjectURL(profilePhoto)}
                  alt="Profile preview"
                  className="absolute inset-0 w-full h-full object-cover rounded-sm"
                />
              ) : (
                <div className="absolute bottom-0 right-0 p-1">
                  <PenSquare className="w-4 h-4 text-[#FF6B2C]" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <label htmlFor="username" className="text-base font-normal text-white w-1/3">Username</label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-[#151621] border-none text-white h-12 w-2/3"
              placeholder="Enter username"
            />
          </div>

          <div className="flex items-start justify-between">
            <label htmlFor="bio" className="text-base font-normal text-white w-1/3 pt-3">Bio</label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-[#151621] border-none text-white min-h-[120px] resize-none w-2/3"
              placeholder="Tell us about yourself"
            />
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-[#EC762E] hover:bg-[#ff8533] text-darkbg2 mt-4"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal

