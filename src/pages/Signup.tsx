import { Button } from "@/components/ui/button";
import { Mail, Github } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const Signup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleEmailSignup = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
    });
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error signing up",
        description: error.message,
      });
    } else {
      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: { email: values.email }
      });

      if (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEmailSignup)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full flex items-center gap-2 justify-center">
              <Mail className="h-4 w-4" />
              Sign up with Email
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 justify-center"
          onClick={handleGithubSignup}
        >
          <Github className="h-4 w-4" />
          Sign up with GitHub
        </Button>
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
