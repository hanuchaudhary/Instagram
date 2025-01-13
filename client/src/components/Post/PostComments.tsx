import { useEffect, useState } from "react";
import { MessageCircle} from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePostCommentsStore } from "@/store/PostsStore/usePostComments";
import CommentTile from "../Tiles/CommentTile";
import CommentInput from "./CommentInput";

const PostComments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { comments, fetchComments, postId} = usePostCommentsStore();
  
  useEffect(() => {
    if (isOpen && postId) {
      fetchComments(postId);
    }
  }, [isOpen, postId]);

  

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button className="mb-2">
          <MessageCircle className="h-7 w-7" />
          <span className="sr-only">Open comments</span>
        </button>
      </DrawerTrigger>
      <DrawerContent className="z-[9999999]">
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
                <CommentTile key={comment.id} {...comment} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                Be the first one to comment on this post!
              </p>
            )}
          </div>
        </ScrollArea>
        <CommentInput />
        <DrawerClose>
          <Button variant="outline">Close</Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default PostComments;
