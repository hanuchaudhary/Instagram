import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";
import { useState } from "react";

export default function CommentInput({
  postId,
}: {
  postId: number;
}) {
  const { postComment } = usePostCommentsStore();
    const [input, setInput] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        postComment(postId, input);
        setInput("");
      }}
      className="flex items-center gap-2 border-t p-4"
    >
      <Input
        type="text"
        placeholder="Share your thoughts..."
        className="flex-grow"
        required
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button type="submit" size="icon">
        <Send className="h-4 w-4" />
        <span className="sr-only">Submit comment</span>
      </Button>
    </form>
  );
}
