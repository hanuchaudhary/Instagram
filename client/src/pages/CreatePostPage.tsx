import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import api from "@/config/axios";
import { BACKEND_URL } from "@/config/config";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import { postSchema } from "@hanuchaudhary/instagram";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Heart,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
  const [reelPreview, setReelPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const { profile } = useProfileStore();

  const [isLoading, setIsLoading] = useState(false);
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

    try {
      setIsLoading(true);
      await api.post(`${BACKEND_URL}/post/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const percentageCompleted = Math.round(
            (event.loaded * 100) / event.total!
          );
          if (percentageCompleted <= 100) {
            setUploadProgress(percentageCompleted);
          }
        },
      });
      toast.success("Post Posted Successfully");
      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =
          error.response.data.message || "Error While Posting";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto md:px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <Card className="border-none rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Create New Post
              </CardTitle>
              <CardDescription>
                Share your moments with the world
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Caption
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Write a caption..."
                            {...field}
                            className="h-20 py-2"
                          />
                        </FormControl>
                        <FormDescription>
                          Describe your post in a few words
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter location (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add a location to your post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mediaURL"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">
                          Upload Media
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-64 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-neutral-50 dark:hover:bg-bray-800 dark:bg-neutral-900 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:border-neutral-500 dark:hover:bg-neutral-600"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-neutral-500 dark:text-neutral-400" />
                                <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                                </p>
                              </div>
                              <Input
                                id="dropzone-file"
                                type="file"
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => {
                                  handleFileChange(e);
                                  field.onChange(e.target.files?.[0]);
                                }}
                              />
                            </label>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Select an image or video to upload
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin mr-2" />
                        Uploading
                      </div>
                    ) : (
                      "Upload Post"
                    )}
                  </Button>
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4">
                      <Progress value={uploadProgress} className="w-full" />
                      <p className="text-sm text-center mt-2">
                        {uploadProgress}% uploaded
                      </p>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="shadow-none bg-popover sticky top-4">
            <CardHeader className="flex p-2 flex-row items-center space-y-0 pb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="object-cover"
                  src={profile.avatar}
                  alt="@username"
                />
                <AvatarFallback>{profile.fullName}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col ml-2">
                <CardTitle className="text-sm font-semibold">
                  {profile.username}
                </CardTitle>
                <CardDescription className="text-xs text-neutral-400">
                  {profile.fullName}
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 min-h-[50vh]">
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
                <div className="h-[50vh] flex items-center justify-center bg-neutral-900">
                  <div className="text-center">
                    <h1 className="text-2xl font-semibold">Post Preview</h1>
                    <p className="text-neutral-400 text-xs">
                      Select an image or video to see the preview of your post
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardContent className="pt-2 p-2">
              <div className="flex space-x-4">
                <div>
                  <Heart className="h-6 fill-rose-600 text-rose-600 w-6" />
                </div>
                <div>
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
              <p className="font-semibold mt-2 text-sm text-neutral-300">
                453K likes
              </p>
              <div className="mt-2">
                <span className="font-semibold">{profile.username} </span>
                <span className="text-sm ">{form.watch("caption")}</span>
              </div>
              <p className="text-neutral-400 text-sm mt-2">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
