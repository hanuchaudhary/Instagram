import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Grid, ImageIcon, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useOtherUserProfileStore } from "@/store/UserStore/useOtherUserProfileStore";
import ProfilePostPopup from "@/components/Profile/ProfilePostPopup";
import ReportShareDialog from "@/components/Report&Share";
import { ShareType } from "@/components/ShareButton";
import { usePostsStore } from "@/store/PostsStore/usePostsStore";
export default function UserProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const { username } = useParams();
  const {setSelectedPostId} = usePostsStore();
  const { fetchProfile, isLoading, profile } = useOtherUserProfileStore();

  const handleClose = () => {
    setIsOpen(false);
    setSelectedPostId(null);
  };

  useEffect(() => {
    fetchProfile(username as string);
  }, [username]);

  const handleSelectPostId = (postId: number) => {
    setSelectedPostId(postId);
    setIsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 max-w-4xl py-6 sm:py-8">
      <Card className="p-6 sm:p-8 relative">
        <div className="absolute flex items-center gap-2 top-2 right-4">
          <ReportShareDialog
            shareType={ShareType.PROFILE}
            reportTargetTitle={profile.username}
            reportType="USER"
            reportedId={profile?.id!}
            targetId={profile.id!}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage
              className="object-cover"
              src={profile.avatar}
              alt={profile.username}
            />
            <AvatarFallback>
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold">{profile.username}</h1>
              <h2 className="text-base text-muted-foreground">
                {profile.fullName}
              </h2>
            </div>
            <div className="flex justify-center sm:justify-start gap-6 sm:gap-8">
              <span className="text-sm">
                <strong>{profile._count.posts}</strong> posts
              </span>
              <span className="text-sm">
                <strong>{profile._count.followers}</strong> followers
              </span>
              <span className="text-sm">
                <strong>{profile._count.following}</strong> following
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-base mb-1">
                {profile.fullName}
              </h2>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="posts"
            className="flex items-center justify-center"
          >
            <Grid className="w-4 h-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="tagged"
            className="flex items-center justify-center"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Tagged
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          {profile.followers ? (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {profile?.posts?.map((post) => (
                <div
                  key={post.id}
                  className="aspect-square cursor-pointer overflow-hidden rounded-sm"
                  onClick={() => handleSelectPostId(post.id!)}
                >
                  {post.mediaType === "video" ? (
                    <video
                      muted
                      src={post.mediaURL}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  ) : (
                    <img
                      src={post.mediaURL}
                      alt={post.caption}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center flex-col w-full bg-secondary/30 rounded-xl p-10 items-center h-full">
              <p className="text-muted-foreground font-semibold text-xl">
                This account is private
              </p>
              <p className="text-muted-foreground text-xs">
                Follow them and let them follow you back to see their posts.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="tagged">
          <div className="text-center py-8 text-muted-foreground">
            <p>Coming Soon!</p>
            <p className="mt-2">Tagged photos will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
      <ProfilePostPopup
        handleClose={handleClose}
        isOpen={isOpen}
      />
    </div>
  );
}
