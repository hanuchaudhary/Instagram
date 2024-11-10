import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, ImageIcon, Loader2 } from "lucide-react";
import { post } from "@/store/atoms/posts";

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatar: string;
  isFollowing?: boolean;
  _count: {
    followers: number;
    following: number;
    posts: number;
  };
  posts: post[];
}

const UserProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/profile/${username}`
        );
        setProfile(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>User not found</p>
      </div>
    );
  }

  return (
    <div className="container px-2 sm:px-4 max-w-6xl py-4 sm:py-8">
      <Card className="p-4 sm:p-8 shadow-none">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center sm:items-start">
          <img
            src={profile.avatar}
            alt={profile.username}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
              <h1 className="text-xl sm:text-2xl font-semibold">
                {profile.username}
              </h1>
              <h2 className="text-sm sm:text-base text-neutral-400">
                {profile.fullName}
              </h2>
            </div>
            <div className="flex justify-center sm:justify-start gap-4 sm:gap-8 mb-4">
              <span className="text-sm sm:text-base">
                <strong>{profile._count.posts}</strong> posts
              </span>
              <span className="text-sm sm:text-base">
                <strong>{profile._count.followers}</strong> followers
              </span>
              <span className="text-sm sm:text-base">
                <strong>{profile._count.following}</strong> following
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-sm sm:text-base">
                {profile.fullName}
              </h2>
              <p className="whitespace-pre-wrap text-sm sm:text-base">
                {profile.bio}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="posts" className="mt-4 sm:mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts" >
            <Grid className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="tagged">
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Tagged
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <div className="grid grid-cols-3 py-2  gap-0.5 sm:gap-1">
            {profile.posts.map((post) => (
              <div key={post.id} className="aspect-square ">
                <img
                  src={post.mediaURL}
                  alt={post.caption}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tagged">
          <div className="text-center py-4 sm:py-8 text-muted-foreground text-sm sm:text-base">
            <p>Coming Soon!</p>
            <p className="mt-2">Tagged photos will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
