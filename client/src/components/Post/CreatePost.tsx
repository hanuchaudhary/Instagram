import { useState, ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Camera, Heart, MapPin, MessageCircle, Send } from "lucide-react";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { postSchema } from "@hanuchaudhary/instagram";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/store/UserStore/useProfileStore";

export default function CreatePost() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { profile } = useProfileStore();
  const { createPost, isCreatingPost } = usePostsStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: "",
      location: "",
      mediaURL: undefined,
    },
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.includes("image")) {
        form.setValue("mediaURL", file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        setSelectedFile(file);
        reader.readAsDataURL(file);
      } else if (file.type.includes("video")) {
        form.setValue("mediaURL", file);
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };

  async function onSubmit(values: z.infer<typeof postSchema>) {
    const formData = new FormData();
    formData.append("caption", values.caption);
    formData.append("location", values.location || "");
    if (selectedFile) formData.append("media", selectedFile);
    createPost(formData, navigate);
  }

  return (
    <div className="space-y-4 md:p-4 p-2 md:mb-0 mb-14">
      <h2 className="text-2xl font-bold">Create New Post</h2>
      <Form {...form}>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="post-image-upload" className="block mb-2">
                <Button
                  variant={"outline"}
                  onClick={() => inputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" /> Upload Image or Video
                </Button>
              </label>
              <Input
                id="post-image-upload"
                type="file"
                accept="image/*, video/*"
                onChange={handleFileChange}
                ref={inputRef}
                className="hidden"
              />
            </div>

            <FormField
              control={form.control}
              name="caption"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Write a caption..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-2 top-1/2 h-5 w-5 transform -translate-y-1/2 text-neutral-400" />
                      <Input
                        placeholder="Enter Location..."
                        className="pl-8"
                        {...field}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                // onClick={handleSaveAsDraft}
              >
                Save as draft
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isCreatingPost}
              >
                {isCreatingPost ? "Creating Post..." : "Share Post"}
              </Button>
            </div>
          </form>
          <div className="relative w-full h-[500px] bg-secondary rounded-lg overflow-hidden">
            {imagePreview ? (
              selectedFile?.type.includes("video") ? (
                <video
                  src={imagePreview}
                  controls
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={imagePreview}
                  alt="Post preview"
                  className="w-full h-full object-contain"
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-neutral-400">
                  Upload an image or video to see preview
                </p>
              </div>
            )}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage className="object-cover" src={profile.avatar || "/user.svg"} alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white leading-none font-semibold text-sm">
                  {profile.username}
                </span>
                {form.watch("location") && (
                  <div className="flex items-center text-neutral-300">
                    <MapPin className="h-3 w-3" />
                    <span className="leading-none text-sm">
                      {form.watch("location")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 w-full">
              <div className="flex items-center gap-1 w-full">
                <Heart className="stroke-red-600 fill-red-600" />
                <MessageCircle />
                <Send />
              </div>
              <p className="text-sm text-neutral-300">
                {form.watch("caption")}
              </p>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}
