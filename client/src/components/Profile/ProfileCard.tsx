import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Link, Loader2, UserCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useProfile } from "@/hooks/Profile/useProfile";
import { currentProfileState } from "@/store/atoms/profile";
import { UserType } from "@/types/TypeInterfaces";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { editProfileSchema } from "@/validations/Validations";
import { Badge } from "../ui/badge";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
  accountType: z.enum(["private", "public"]),
  avatar: z.instanceof(File).optional(),
});

export default function ProfileCard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  useProfile();
  const profileData = useRecoilValue(currentProfileState);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 p-6 rounded-lg shadow-md">
      <div className="flex-shrink-0">
        <Avatar className="h-32 w-32">
          <AvatarImage src={profileData.avatar} alt={profileData.fullName} />
          <AvatarFallback className="text-2xl uppercase font-bold">
            <UserCircle className="fill-neutral-400 h-20 w-20 text-neutral-400" />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-2xl font-bold">{profileData.username}</h1>
          <div className="flex gap-2">
            <EditProfile profileData={profileData} />
            <Button onClick={handleLogout} size="sm" variant="destructive">
              Logout
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span>
            <strong>{profileData._count.posts}</strong> Posts
          </span>
          <span>
            <strong>{profileData._count.followers}</strong> Followers
          </span>
          <span>
            <strong>{profileData._count.following}</strong> Following
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <h2 className="font-semibold">{profileData.fullName}</h2>
            <Badge className="capitalize font-semibold">
              {profileData.accountType}
            </Badge>
          </div>
          <p className="text-sm text-neutral-500 font-semibold">
            {profileData.bio}
          </p>
          <div className="flex items-center gap-1 text-blue-500">
            <Link size={16} />
            <a
              href="https://github.com/hanuchaudhary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              github.com/hanuchaudhary
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProfile({ profileData }: { profileData: UserType }) {
  const [imagePreview, setImagePreview] = useState(profileData.avatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profileData.fullName,
      bio: profileData.bio,
      accountType: "public",
      avatar: profileData.avatar,
    },
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      setImagePreview((reader.result as string) || undefined);
      reader.readAsDataURL(file);
      setSelectedFile(file);
      form.setValue("avatar", file);
    }
  };

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("bio", values.bio as string);
    formData.append("accountType", values.accountType);
    if (selectedFile) formData.append("avatar", selectedFile);
    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/user/edit`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("token")?.split(" ")[1]}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Edited Successfully");
    } catch (error) {
      toast.error("Error while updating profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm">Edit Profile</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          {/* @ts-ignore */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center justify-center">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  className="object-cover"
                  src={imagePreview || profileData.avatar}
                  alt={profileData.fullName}
                />
                <AvatarFallback>
                  {profileData.fullName
                    .split(" ")
                    .map((e) => e[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <FormField
              control={form.control}
              name="avatar"
              render={() => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Upload a new profile picture
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write something about yourself..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button disabled={isLoading} type="submit">
                {form.formState.isSubmitting && (
                  <Loader2 className="animate-spin" />
                )}
                Save Changes
              </Button>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </AlertDialogTrigger>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
