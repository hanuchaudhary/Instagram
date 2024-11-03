"use client";

import { useState } from "react";
import { MessageCircle, Send, UserCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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

import { BACKEND_URL } from "@/config/config";
import { comment } from "@/store/atoms/posts";
import { usePosts } from "@/hooks/Posts/usePosts";

const PostComments = ({
  postId,
  comments,
}: {
  postId: number;
  comments: comment[];
}) => {
  const { fetchPosts } = usePosts();
  const [comment, setComment] = useState("");

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";

    return Math.floor(seconds) + " seconds ago";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    try {
      await axios.post(
        `${BACKEND_URL}/feature/comment/${postId}`,
        { comment },
        {
          headers: {
            Authorization: localStorage.getItem("token")?.split(" ")[1],
          },
        }
      );
      toast.success("Your comment has been added to the discussion!");
      setComment("");
      fetchPosts();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message ||
            "Failed to post your comment. Please try again."
        );
      } else {
        toast.error(
          "Something went wrong while posting your comment. Please try again later."
        );
      }
    }
  };

  return (
    <Drawer>
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
        <ScrollArea className="mx-auto h-[50vh] rounded-xl bg-neutral-900 p-4 md:h-[60vh]">
          <div className="w-[320px] md:w-[700px] flex flex-col gap-2">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-neutral-800 p-2"
                >
                  <div className="flex items-center gap-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
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
                  <div>
                    <p>{comment.comment}</p>
                    <p className="text-xs text-neutral-400">
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
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t p-4"
        >
          <Input
            type="text"
            placeholder="Share your thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Submit comment</span>
          </Button>
        </form>
        <DrawerClose>
          <Button variant="outline">
            Close
          </Button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default PostComments;
