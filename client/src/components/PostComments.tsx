import { useEffect, useState } from "react";
import { MessageCircle, Send, UserCircle } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTimeAgo } from "@/lib/getTimeFormat";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";

const PostComments = ({ postId }: { postId: number }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { comments, fetchComments, postComment } = usePostCommentsStore();

  useEffect(() => {
    if (isOpen) {
      fetchComments(postId);
    }
  }, [isOpen, postId]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="mb-2">
          <MessageCircle className="h-6 w-6" />
          <span className="sr-only">Open comments</span>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Comments</DrawerTitle>
          <DrawerDescription>
            Join the conversation and share your thoughts
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="mx-auto h-[50vh] rounded-xl bg-primary-foreground my-1 p-4 md:h-[60vh]">
          <div className="w-[320px] md:w-[700px] flex flex-col gap-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start justify-between gap-4 bg-secondary rounded-xl p-2"
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          className="object-cover"
                          src={comment.user.avatar}
                          alt={comment.user.username}
                        />
                        <AvatarFallback className="capitalize">
                          <UserCircle className="fill-neutral-400 text-neutral-400" />
                        </AvatarFallback>
                      </Avatar>
                      <h1 className="text-sm font-semibold capitalize">
                        {comment.user.username}
                      </h1>
                    </div>
                  </div>
                  <div>
                    <p className="md:text-base text-sm ">{comment.comment}</p>
                    <p className="text-xs text-right text-neutral-400">
                      {getTimeAgo(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                Be the first one to comment on this post!
              </p>
            )}
          </div>
        </ScrollArea>
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
        <DrawerClose>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default PostComments;
