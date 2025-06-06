 import { useState } from "react"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"
import { useTranslation } from "react-i18next";


// Helper for avatar initials background color
function getColorFromName(name) {
  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
    "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
    "bg-orange-500", "bg-rose-500"
  ]
  const index = name?.charCodeAt(0) % colors.length
  return colors[index]
}

export function ProfileDialog({ user }) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false)
  const [first_name, setName] = useState(user?.first_name || "")
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "")

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = () => {
    const formData = new FormData()
    formData.append("first_name", first_name)

    if (avatarFile) {
        formData.append("avatar", avatarFile)
    } else if (user.avatar && !avatarPreview) {
        formData.append("remove_avatar", "1") 
    }

    router.post("/settings/update", formData, {
        forceFormData: true,
    })

    setOpen(false)
}


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
         <Button variant="ghost">
          <User className="mr-2 h-4 w-4" />
          {t("manage-profile.profile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("manage-profile.accountSettings")}</DialogTitle>
          <DialogDescription>
            {t("manage-profile.accountSettingsDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">{t("manage-profile.displayName")}</Label>
            <Input
              id="first_name"
              value={first_name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">{t("manage-profile.profileImage")}</Label>
            <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
            />
            <div className="flex items-center space-x-4 mt-2">
                {avatarPreview ? (
                <>
                    <img
                    loading="lazy"
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full object-cover"
                    />
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview("")
                    }}
                    >
                   {t("manage-profile.removeImage")}
                    </Button>
                </>
                ) : (
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-medium text-lg ${getColorFromName(first_name)}`}
                >
                    {first_name?.charAt(0).toUpperCase()}
                </div>
                )}
                <span className="text-sm text-muted-foreground"> {t("manage-profile.preview")}</span>
            </div>
            </div>


          <div className="space-y-2">
            <Label htmlFor="email">{t("manage-profile.email")}</Label>
            <Input
              id="email"
              value={user?.email}
              readOnly
              className="opacity-70 cursor-not-allowed"
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>{t("manage-profile.saveChanges")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}