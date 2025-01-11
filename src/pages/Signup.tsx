import { Button } from "@/components/ui/button";
import { Mail, Github } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSignup = async () => {
    const email = prompt('Please enter your email to sign up:');
    if (!email) return;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign up.",
      });
      navigate('/home');
    }
  };

  const handleGithubSignup = async () => {
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

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground mt-2">Sign up to get started</p>
        </div>
        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleEmailSignup}
          >
            <Mail className="h-4 w-4" />
            Sign up with Email
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleGithubSignup}
          >
            <Github className="h-4 w-4" />
            Sign up with GitHub
          </Button>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
            Sign in
          </Button>
        </p>
      </div>
    </div>
  );
};

export default Signup;