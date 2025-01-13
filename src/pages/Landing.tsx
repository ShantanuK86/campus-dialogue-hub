import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Users, FileText, Clock, Shield, UserCheck } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Global & Campus Chats",
      description: "Connect with peers through global and campus-specific chat rooms"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Private Messaging",
      description: "Send direct messages to fellow students and faculty members"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Forums",
      description: "Engage in academic discussions and share knowledge"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Event Planning",
      description: "Organize and coordinate campus events and activities"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "NGL Feature",
      description: "Share anonymous messages with your campus community"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-primary" />,
      title: "Real Profile",
      description: "Create and customize your academic profile"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Exclusive Social Hub for
            <br />
            Cavite State University
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            A social media platform that's only accessible for
            <br />
            Cavite State University students, faculty, and alumni.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-primary hover:bg-primary/90"
            >
              Sign Up with CSU Account
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            By signing up, you agree to our Terms of Service
          </p>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-card hover:shadow-lg transition-shadow">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">
            Share and receive anonymous messages, express freely,
            <br />
            and connect like never before!
          </h2>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Send us an anonymous message!
          </Button>
        </section>
      </div>
    </div>
  );
};

export default Landing;