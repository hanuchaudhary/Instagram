import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
import { postSchema } from "@hanuchaudhary/instagram";

export default function CreateReel() {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [reelPreview, setReelPreview] = useState("");
  const { createPost, isCreatingPost } = usePostsStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: "",
      location: "",
      mediaURL: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.includes("image")) {
      form.setValue("mediaURL", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      setSelectedFile(file);
      reader.readAsDataURL(file);
    }

    if (file?.type.includes("video")) {
      form.setValue("mediaURL", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReelPreview(reader.result as string);
      };
      setSelectedFile(file);
      reader.readAsDataURL(file);
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
    <div className="container max-w-2xl mx-auto px-4 py-8 md:mb-0 mb-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground text-lg">
          Share your moment with the world
        </p>
      </div>

      <Card className="border-2 border-dashed">
        <CardContent className="p-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mediaURL"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className="flex flex-col items-center justify-center w-full">
                        <label
                          htmlFor="dropzone-file"
                          className="flex flex-col items-center justify-center w-full min-h-[300px] cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          {imagePreview ? (
                            <img
                              src={imagePreview}
                              alt="Post Preview"
                              className="w-full aspect-square object-contain"
                            />
                          ) : reelPreview ? (
                            <video
                              src={reelPreview}
                              controls
                              className="w-full aspect-square object-contain"
                            />
                          ) : (
                            <div className="h-[50vh] flex items-center justify-center w-full">
                              <div className="text-center">
                                <h1 className="text-2xl font-semibold">
                                  Post Preview
                                </h1>
                                <p className="text-neutral-400 text-xs">
                                  Select an image or video to see the preview of
                                  your post
                                </p>
                              </div>
                            </div>
                          )}
                          <Input
                            id="dropzone-file"
                            type="file"
                            accept="image/*, video/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="px-6">
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
              </div>
              <div className="px-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter Location..."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 p-6 pt-0">
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
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
