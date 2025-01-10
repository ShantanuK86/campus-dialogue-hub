import { AppBar } from "@/components/AppBar";
import { PostCard } from "@/components/PostCard";
import { TrendingUp } from "lucide-react";

const TRENDING_POSTS = [
  {
    title: "How to effectively prepare for Computer Science finals?",
    preview: "I'm struggling with algorithm complexity and data structures...",
    votes: 45,
    answers: 12,
    author: "John Doe",
    role: "student",
    timestamp: "2h ago",
    trending: true,
  },
  {
    title: "Best practices for research paper citations",
    preview: "Looking for guidance on APA format and academic writing...",
    votes: 38,
    answers: 8,
    author: "Dr. Smith",
    role: "teacher",
    timestamp: "4h ago",
    trending: true,
  },
] as const;

const LATEST_POSTS = [
  {
    title: "Campus WiFi connectivity issues in Library",
    preview: "Has anyone else experienced connection drops...",
    votes: 12,
    answers: 3,
    author: "Jane Smith",
    role: "student",
    timestamp: "30m ago",
  },
  {
    title: "Announcement: New Learning Management System",
    preview: "We're upgrading our LMS platform to improve...",
    votes: 25,
    answers: 15,
    author: "Admin Team",
    role: "admin",
    timestamp: "1h ago",
  },
] as const;

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar />
      <main className="container py-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Trending Discussions
          </h2>
          <div className="grid gap-6">
            {TRENDING_POSTS.map((post) => (
              <PostCard key={post.title} {...post} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
          <div className="grid gap-6">
            {LATEST_POSTS.map((post) => (
              <PostCard key={post.title} {...post} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
