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
import { BACKEND_URL } from "@/config/config";
import { postSchema } from "@hanuchaudhary/instagram";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState("");
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
    if (file) {
      form.setValue("mediaURL", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
      await axios.post(`${BACKEND_URL}/post/create`, formData, {
        headers: {
          Authorization: localStorage.getItem("token")?.split(" ")[1],
          "Content-Type": "multipart/form-data",
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-3">
          <Card className="border-none rounded-none shadow-none">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
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
                        <FormLabel>Caption</FormLabel>
                        <FormControl>
                          <Input placeholder="Write a caption..." {...field} />
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
                        <FormLabel>Location</FormLabel>
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
                        <FormLabel>Upload Media</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              handleFileChange(e);
                              field.onChange(e.target.files?.[0]);
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Select an image or video to upload
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin" />
                        Uploading
                      </div>
                    ) : (
                      "Upload Post"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 pb-10 px-2">
          <Card className="rounded-none  shadow-none">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your post will look</CardDescription>
            </CardHeader>
            <CardContent className="h-56 w-full p-0 pb-5 flex aspect-square items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <p>No media selected</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
