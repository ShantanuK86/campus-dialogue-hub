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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
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

  const handleVote = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .update({ votes: (post?.votes || 0) + 1 })
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error updating votes",
        description: error.message,
      });
      return;
    }

    fetchPost();
    toast({
      title: "Success",
      description: "Vote recorded successfully",
    });
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
              variant="outline"
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