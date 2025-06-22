import { Link } from 'react-router-dom';
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FC } from "react";

interface ProfileDropdownProps {
  isAdmin?: boolean;
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({ isAdmin = false }) => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {isAdmin && (
            <DropdownMenuItem asChild>
              <Link to="/admin">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={signOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileDropdown;
