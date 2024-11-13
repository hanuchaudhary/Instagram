import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Grid, ImageIcon, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

interface Post {
  id: string;
  mediaURL: string;
  caption: string;
}

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
  posts: Post[];
}

export default function UserProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

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
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
          <Avatar className="w-24 h-24 md:w-32 md:h-32">
            <AvatarImage className="object-cover" src={profile.avatar} alt={profile.username} />
            <AvatarFallback>
              {profile.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4">
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
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {profile.posts.map((post) => (
              <div
                key={post.id}
                className="aspect-square cursor-pointer overflow-hidden rounded-sm"
                onClick={() => {
                  setSelectedPost(post);
                  setIsOpen(true);
                }}
              >
                <img
                  src={post.mediaURL}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tagged">
          <div className="text-center py-8 text-muted-foreground">
            <p>Coming Soon!</p>
            <p className="mt-2">Tagged photos will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
      <AnimatePresence>
        {isOpen && selectedPost && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="relative w-full max-w-2xl max-h-full aspect-square bg-background rounded-lg shadow-lg p-6">
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 p-2 rounded-full bg-background/80 text-foreground hover:bg-background/60 transition-colors"
              >
                <X className="w-6 h-6" />
                <span className="sr-only">Close</span>
              </button>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden rounded-md">
                  <img
                    src={selectedPost.mediaURL}
                    alt={selectedPost.caption}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-center mt-4 text-sm text-muted-foreground">
                  {selectedPost.caption}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
