import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-secondary dark:bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Exclusive Social Hub for
            <br />
            College Students
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A social media platform that's exclusive for college students, faculty, and alumni.
            Share knowledge, connect with peers, and engage in meaningful discussions.
          </p>
          
          <div className="flex flex-col items-center gap-6 mt-12">
            <Link to="/signup">
              <Button size="lg" className="text-lg px-8 bg-primary hover:bg-primary/90">
                Sign up with College Account
              </Button>
            </Link>
            <p className="text-sm text-gray-400">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            <FeatureCard
              icon="👥"
              title="Connect"
              description="Easily find and connect with other students and faculty members."
            />
            <FeatureCard
              icon="💡"
              title="Share Knowledge"
              description="Share your academic insights and learn from others."
            />
            <FeatureCard
              icon="🚀"
              title="Grow Together"
              description="Join discussions and grow your academic network."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <div className="p-6 rounded-lg bg-accent/10 backdrop-blur-sm border border-white/10">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

export default Landing;