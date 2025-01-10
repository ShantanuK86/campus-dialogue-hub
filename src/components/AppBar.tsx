import { Button } from "@/components/ui/button";
import { LogIn, LogOut, UserPlus, User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import type { User } from '@supabase/supabase-js';

export const AppBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message,
      });
    }
  };

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <div className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-primary">CollegeStack</h1>
        </div>
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={handleLogin}
              >
                <LogIn className="h-4 w-4" />
                Login
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={handleSignUp}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {user.email}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};