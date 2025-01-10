import { useState } from "react";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Tag } from "lucide-react";

const QUESTIONS = [
  {
    title: "How to effectively prepare for Computer Science finals?",
    preview: "I'm struggling with algorithm complexity and data structures...",
    votes: 45,
    answers: 12,
    author: "John Doe",
    role: "student" as const,
    timestamp: "2h ago",
    tags: ["computer-science", "algorithms", "finals"] as string[],
  },
  {
    title: "Best practices for research paper citations",
    preview: "Looking for guidance on APA format and academic writing...",
    votes: 38,
    answers: 8,
    author: "Dr. Smith",
    role: "teacher" as const,
    timestamp: "4h ago",
    tags: ["research", "writing", "citations"] as string[],
  },
];

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = Array.from(
    new Set(QUESTIONS.flatMap((question) => question.tags))
  );

  const filteredQuestions = QUESTIONS.filter((question) => {
    const matchesSearch = question.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => question.tags.includes(tag));
    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Tag className="h-4 w-4 text-gray-500" />
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {filteredQuestions.map((question) => (
          <div key={question.title}>
            <PostCard {...question} />
            <div className="mt-2 flex gap-2">
              {question.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Questions;