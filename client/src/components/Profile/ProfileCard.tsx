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
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { editProfileSchema } from "@hanuchaudhary/instagram";
import FollowersDrawer from "./FollowersDrawer";

export default function ProfileCard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/signin");
  };

  useProfile();
  const profileData = useRecoilValue(currentProfileState);

  return (
    <div className="md:px-40 flex flex-col rounded-none  gap-6 p-4 md:p-6 shadow-md">
      <div className="flex gap-5 md:w-96">
        <div className="">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage className="object-cover" src={profileData.avatar} alt={profileData.fullName} />
            <AvatarFallback className="text-2xl uppercase font-bold">
              <UserCircle className="fill-neutral-400 h-16 w-16 md:h-20 md:w-20 text-neutral-400" />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="username w-full btn flex flex-col items-start gap-4">
          <h1 className="text-xl md:text-2xl font-bold">
            {profileData.username}
          </h1>
          <div className="flex gap-2">
            <EditProfile profileData={profileData} />
            <Button onClick={handleLogout} size="sm" variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </div>
      <div className=" space-y-4 w-full">
        <div className="data flex items-start gap-4 md:gap-6 text-base md:text-lg">
          <span>
            <strong className="font-semibold text-lg md:text-xl">
              {profileData._count.posts}
            </strong>{" "}
            Posts
          </span>
          <span className="flex gap-1">
            <strong className="text-lg md:text-xl">
              {profileData._count.followers}
            </strong>{" "}
            <FollowersDrawer/>
          </span>
          <span>
            <strong className="text-lg md:text-xl">
              {profileData._count.following}
            </strong>{" "}
            Following
          </span>
        </div>
        <div className="bio space-y-2">
          <div className="flex items-start gap-2">
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
  const [closeDialog, setCloseDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(profileData.avatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profileData.fullName,
      bio: profileData.bio,
      accountType: profileData.accountType,
      avatar: undefined,
    },
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
      form.setValue("avatar", file);
    }
  };

  async function onSubmit(values: z.infer<typeof editProfileSchema>) {
    const formData = new FormData();
    if (values.name) formData.append("name", values.name);
    if (values.bio) formData.append("bio", values.bio);
    if (values.accountType) formData.append("accountType", values.accountType);
    if (selectedFile) formData.append("avatar", selectedFile);

    if (formData.entries().next().done) {
      toast.error("No changes to update");
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/user/edit`, formData, {
        headers: {
          Authorization: `${localStorage.getItem("token")?.split(" ")[1]}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Profile Edited Successfully");
      setCloseDialog(false);
    } catch (error) {
      toast.error("Error while updating profile");
      console.error("Error updating profile:", error);
      setCloseDialog(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={closeDialog} onOpenChange={setCloseDialog}>
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
