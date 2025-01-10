import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, MessageSquare } from "lucide-react";

interface PostCardProps {
  title: string;
  preview: string;
  votes: number;
  answers: number;
  author: string;
  role: "student" | "teacher" | "admin";
  timestamp: string;
  trending?: boolean;
  tags?: string[];
}

export const PostCard = ({
  title,
  preview,
  votes,
  answers,
  author,
  role,
  timestamp,
  trending,
  tags,
}: PostCardProps) => {
  const roleColors = {
    student: "bg-blue-100 text-blue-800",
    teacher: "bg-green-100 text-green-800",
    admin: "bg-purple-100 text-purple-800",
  };

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">{title}</h3>
            {trending && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Trending
              </Badge>
            )}
          </div>
          <p className="text-gray-600 line-clamp-2">{preview}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{votes} votes</span>
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <MessageSquare className="h-4 w-4" />
            {answers}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{timestamp}</span>
          <div className={`px-2 py-1 rounded-full text-xs ${roleColors[role]}`}>
            {role}
          </div>
          <span className="text-sm font-medium">{author}</span>
        </div>
      </div>
    </Card>
  );
};