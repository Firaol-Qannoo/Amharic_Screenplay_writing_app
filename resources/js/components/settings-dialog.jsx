import { useState, useEffect } from "react"
import { router, usePage } from "@inertiajs/react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Settings } from "lucide-react"
import i18n from "@/i18n"; 
import { useTranslation } from "react-i18next";


export function SettingsDialog({ user }) {
  const { flash } = usePage().props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false)
  const [first_name, setName] = useState(user?.first_name || "")
 const [langPref, setLangPref] = useState(user?.lang_pref || "en");



 const handleSave = () => {
  router.post("/settings/update", {
    first_name,
    lang_pref: langPref,
  });

  // Apply change on frontend
  i18n.changeLanguage(langPref);
  localStorage.setItem("lang", langPref);

  setOpen(false);
};


 const handleLangChange = (lang) => {
  setLangPref(lang); // just store selected lang
};



 useEffect(() => {
  if (user?.lang_pref) {
    i18n.changeLanguage(user.lang_pref);
    localStorage.setItem("lang", user.lang_pref);
  }
 }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("setting_mgt.settings.title")}</DialogTitle>
          <DialogDescription>
           {t("setting_mgt.settings.description")}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">{t("setting_mgt.settings.tabs.general")}</TabsTrigger>
            <TabsTrigger value="account">{t("setting_mgt.settings.tabs.account")}</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t("setting_mgt.settings.interface_language")}</Label>
            <select
              id="language"
              value={langPref}
              onChange={(e) => handleLangChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="am">አማርኛ (Amharic)</option>
              <option value="en">English</option>
            </select>


            </div>
            {/* <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-save">Auto Save</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically save your work every few minutes
                </div>
              </div>
              <Switch id="auto-save" defaultChecked />
            </div> */}
            {/* <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive notifications for comments and updates
                </div>
              </div>
              <Switch id="notifications" defaultChecked />
            </div> */}
          </TabsContent>

      
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t("setting_mgt.settings.display_name")}</Label>
              <Input
                id="first_name"
                value={first_name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button onClick={handleSave}>{t("setting_mgt.actions.save_changes")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}