import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, FileText, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Landing = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        
        setUsername(profile?.username);
      }
    };

    getProfile();
  }, []);

  const handleForumClick = () => {
    if (username) {
      navigate('/home');
    }
  };

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Real-time Chat",
      description: "Connect with classmates instantly"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Study Groups",
      description: "Form and join study groups"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Forums",
      description: "Engage in academic discussions and share knowledge",
      onClick: handleForumClick,
      active: !!username
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Event Planning",
      description: "Schedule and manage study sessions"
    }
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">
            {username ? `Welcome back, ${username}!` : "Sign Up with Your College Account"}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join your college community today
          </p>
          {!username && (
            <>
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="mb-4"
              >
                Get Started
              </Button>
              <p className="text-sm text-muted-foreground">
                By signing up, you agree to our Terms of Service
              </p>
            </>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`p-6 bg-card hover:shadow-lg transition-shadow ${
                  feature.active ? 'cursor-pointer' : ''
                }`}
                onClick={feature.onClick}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;