import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Comments } from "@/components/Comments";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

interface Post {
  id: string;
  title: string;
  content: string;
  votes: number;
  created_at: string;
  profiles: {
    username: string;
  };
  posts_tags: {
    tags: {
      name: string;
    };
  }[];
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
    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles (
          username
        ),
        posts_tags (
          tags (
            name
          )
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
    <div className="container py-8">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Posted by {post.profiles.username}
              </span>
              <span className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <Button
              variant={hasVoted ? "default" : "outline"}
              className="flex items-center gap-2"
              onClick={handleVote}
            >
              <ThumbsUp className="h-4 w-4" />
              {post.votes} votes
            </Button>
          </div>
          {post.posts_tags && post.posts_tags.length > 0 && (
            <div className="flex gap-2 mb-4">
              {post.posts_tags.map((pt) => (
                <Badge key={pt.tags.name} variant="secondary">
                  {pt.tags.name}
                </Badge>
              ))}
            </div>
          )}
          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>
        </div>
        <Comments postId={post.id} />
      </Card>
    </div>
  );
};

export default PostDetails;