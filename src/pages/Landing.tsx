import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl font-bold text-primary">Welcome to CollegeStack</h1>
          <p className="text-xl text-gray-600">
            Your comprehensive platform for campus discussions, knowledge sharing, and academic collaboration.
          </p>
          
          <div className="grid gap-6 max-w-xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-primary">Why Choose CollegeStack?</h2>
              <ul className="text-left space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Connect with fellow students and faculty members</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Get answers to your academic questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Share knowledge and experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Stay updated with campus discussions</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8">
            <Link to="/home">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;