import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User } from "lucide-react";

export const AppBar = () => {
  return (
    <div className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">CollegeStack</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
        </div>
      </div>
    </div>
  );
};