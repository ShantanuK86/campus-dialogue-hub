import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Comments } from "@/components/Comments";

interface Post {
  id: string;
  title: string;
  content: string;
  votes: number;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    checkUserVote();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Error fetching post",
        description: error.message,
      });
      return;
    }

    setPost(data);
  };

  const checkUserVote = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) return;

    const { data } = await supabase
      .from("user_votes")
      .select()
      .eq("post_id", id)
      .eq("user_id", session.session.user.id)
      .single();

    setHasVoted(!!data);
  };

  const handleVote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      if (hasVoted) {
        // Remove vote
        await supabase
          .from("user_votes")
          .delete()
          .eq("post_id", id)
          .eq("user_id", user.id);

        await supabase
          .from("posts")
          .update({ votes: (post?.votes || 0) - 1 })
          .eq("id", id);

        setHasVoted(false);
      } else {
        // Add vote
        await supabase
          .from("user_votes")
          .insert({ post_id: id, user_id: user.id });

        await supabase
          .from("posts")
          .update({ votes: (post?.votes || 0) + 1 })
          .eq("id", id);

        setHasVoted(true);
      }

      fetchPost();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating vote",
        description: error.message,
      });
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">{post.title}</h1>
                <span className="text-sm text-muted-foreground">
                  Posted by {post.profiles.username}
                </span>
              </div>
            </div>
            <Button
              variant={hasVoted ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={handleVote}
            >
              <ArrowBigUp className="h-5 w-5" />
              <span>{post.votes}</span>
            </Button>
          </div>
          <div className="prose max-w-none mb-6">
            <p>{post.content}</p>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {format(new Date(post.created_at), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <Comments postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetails;