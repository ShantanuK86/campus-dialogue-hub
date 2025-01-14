import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, FileText, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const { toast } = useToast();

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

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8 text-primary" />,
      title: "Real-time Chat",
      description: "Connect with classmates instantly",
      path: "chat"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Study Groups",
      description: "Form and join study groups",
      path: "groups"
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Forums",
      description: "Engage in academic discussions and share knowledge",
      path: "forums",
      requiresAuth: true
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Event Planning",
      description: "Schedule and manage study sessions",
      path: "events"
    }
  ];

  const faqs = [
    {
      question: "What is this platform about?",
      answer: "This is an exclusive social platform for our college students to connect, collaborate, and share academic resources."
    },
    {
      question: "How do I join study groups?",
      answer: "Once registered, you can browse and join existing study groups or create your own based on your courses and interests."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we implement industry-standard security measures to protect your data and maintain your privacy."
    },
    {
      question: "How can I report inappropriate content?",
      answer: "You can report any inappropriate content through the report button available on posts and comments, or contact our support team."
    }
  ];

  const handleFeatureClick = (feature: string) => {
    if (feature === 'Forums' && username) {
      navigate('/home');
    } else if (feature === 'Forums' && !username) {
      toast({
        title: "Authentication Required",
        description: "Please login to access the forums.",
        variant: "destructive",
      });
    } else {
      navigate(`/${feature.toLowerCase()}`);
    }
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you soon!",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          {username ? (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-primary">
                Welcome back, {username}!
              </h2>
              <p className="text-muted-foreground mt-2">
                Ready to continue learning and sharing?
              </p>
            </div>
          ) : (
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Our College Community Hub
            </h1>
          )}
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

        {/* Features Section with Carousel */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent className="-ml-1">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card 
                      className={`p-6 bg-card hover:shadow-lg transition-all duration-300 ${
                        (feature.requiresAuth && username) || !feature.requiresAuth ? 'cursor-pointer opacity-100' : 'opacity-70'
                      }`}
                      onClick={() => handleFeatureClick(feature.title)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        {/* FAQ Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <Input placeholder="Your Name" required />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" required />
              </div>
              <div>
                <Textarea placeholder="Your Message" required />
              </div>
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;