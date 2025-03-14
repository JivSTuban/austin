import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FC, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const ProfileDropdown: FC = () => {
  const { user, signOut } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.user_metadata?.avatar_url || "");

  const handlePhotoUpdate = async () => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { avatar_url: photoUrl }
      });

      if (error) throw error;

      // Update local state after successful update
      setPhotoUrl(data.user.user_metadata.avatar_url);
      toast.success("Profile photo updated successfully");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error("Failed to update profile photo", {
        description: error.message
      });
    }
  };

  const handleEditPhoto = () => {
    setIsDropdownOpen(false);
    setIsDialogOpen(true);
  };

  if (!user) return null;

  return (
    <div className="relative overflow-y-visible">
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleEditPhoto}>
            Edit Profile Photo
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={photoUrl} />
                <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Photo URL"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
              <Button onClick={handlePhotoUpdate} className="w-full">
                Update Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDropdown;
