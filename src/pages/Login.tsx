import { Button } from "@/components/ui/button";
import { Mail, Github } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // Listen for authentication state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.id) {
        setIsLoading(true); // Set loading when signed in
        try {
          // Check if profile exists for the user
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            toast({
              variant: "destructive",
              title: "Error",
              description: "Could not verify user profile.",
            });
            return;
          }

          if (!profile) {
            toast({
              variant: "destructive",
              title: "Account not found",
              description: "Please sign up first to create an account.",
            });
            navigate('/signup');
            return;
          }

          navigate('/home');
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "An unexpected error occurred.",
          });
        } finally {
          setIsLoading(false); // Reset loading state
        }
      } else if (event === 'SIGNED_OUT') {
        setIsLoading(false); // Reset loading on sign out
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleEmailLogin = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: values.email,
      });

      if (signInError) {
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: signInError.message,
        });
        return;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: error.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-6xl font-bold tracking-tight">Welcome</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              We are glad to see you back with us
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailLogin)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input 
                          placeholder="Email" 
                          type="email" 
                          className="pl-10 h-12 text-base"
                          {...field}
                          disabled={isLoading}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-12 text-base bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Next"}
              </Button>
            </form>
          </Form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleGithubLogin}
            disabled={isLoading}
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
          </p>
        </div>
      </div>
      <div className="hidden lg:block lg:flex-1 bg-[#C84E2C] p-8">
        <img
          src="/lovable-uploads/66b8637e-5b8a-4b66-a0ed-a8f2bff12a2c.png"
          alt="Login illustration"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Login;