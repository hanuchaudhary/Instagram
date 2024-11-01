import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { postSchema } from "@/validations/Validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const CreatePostPage = () => {
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      caption: "",
      mediaURL: "",
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof postSchema>) {
    console.log(values);
    // Here you would typically handle the form submission,
    // such as sending the data to an API
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Upload Media</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              onChange(file);
                            }}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Select an image or video to upload
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Create Post</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="rounded-none shadow-none">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your post will look</CardDescription>
            </CardHeader>
            <CardContent className="h-56 bg-slate-100">
              <img src="" alt="" />
            </CardContent>
            <CardFooter>
              <p>Additional details or actions can go here</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPage;
