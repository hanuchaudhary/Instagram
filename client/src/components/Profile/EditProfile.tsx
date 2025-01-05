import { useState } from "react";
import { Loader2 } from 'lucide-react';
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
import { UserType } from "@/types/TypeInterfaces";
import { toast } from "sonner";
import { editProfileSchema } from "@hanuchaudhary/instagram";
import { useProfileStore } from "@/store/UserStore/useProfileStore";

export default function EditProfile({ profileData }: { profileData: UserType }) {
  const [closeDialog, setCloseDialog] = useState(false);
  const [imagePreview, setImagePreview] = useState(profileData.avatar);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUpdatingProfile, updateProfile } = useProfileStore();

  const form = useForm({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profileData.fullName,
      bio: profileData.bio,
      accountType: profileData.accountType,
      avatar: undefined as File | undefined,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    updateProfile(formData);
    setCloseDialog(true);
  }

  return (
    <AlertDialog open={closeDialog} onOpenChange={setCloseDialog}>
      <AlertDialogTrigger asChild>
        <Button size="sm">Edit Profile</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px] bg-secondary border-none sm:rounded-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Profile</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <AvatarUpload
              imagePreview={imagePreview as string}
              profileData={profileData}
              handleImageChange={handleImageChange}
            />
            <AccountTypeSelect control={form.control} />
            <NameInput control={form.control} />
            <BioTextarea control={form.control} />
            <FormActions isUpdatingProfile={isUpdatingProfile} />
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AvatarUpload({ imagePreview, profileData, handleImageChange }: { imagePreview: string; profileData: UserType; handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <>
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
        name="avatar"
        render={() => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full dark:bg-neutral-700 bg-neutral-200"
              />
            </FormControl>
            <FormDescription>
              Upload a new profile picture
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

function AccountTypeSelect({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="accountType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account Type</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger  className="dark:bg-neutral-700 bg-neutral-200">
                <SelectValue className="dark:bg-neutral-700 bg-neutral-200" placeholder="Select account type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="dark:bg-neutral-700 bg-neutral-200">
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function NameInput({ control }: any) {
  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input className="dark:bg-neutral-700 bg-neutral-200" placeholder="Enter your name" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function BioTextarea({ control } : any) {
  return (
    <FormField
      control={control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bio</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Write something about yourself..."
              className="resize-none dark:bg-neutral-700 bg-neutral-200"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FormActions({ isUpdatingProfile }: { isUpdatingProfile: boolean }) {
  return (
    <div className="flex justify-end gap-4">
      <Button disabled={isUpdatingProfile} type="submit">
        {isUpdatingProfile && <Loader2 className="animate-spin mr-2" />}
        Save Changes
      </Button>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="outline">
          Cancel
        </Button>
      </AlertDialogTrigger>
    </div>
  );
}

