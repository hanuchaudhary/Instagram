import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useFollowDataStore } from "@/store/UserStore/useFollowDataStore";

const FollowersDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fetchFollowData, followers, following, isLoading, unFollowUser } =
    useFollowDataStore();
  useEffect(() => {
    fetchFollowData();
  }, [fetchFollowData]);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <h1 className="text-xl hover:underline cursor-pointer transition-all font-normal">
            Followers
          </h1>
        </DialogTrigger>
        <DialogContent className="p-2 md:p-4">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-bold">
              Followers & Following
            </DialogTitle>
            <DialogDescription>
              View and manage your connections
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 items-center justify-center w-full">
            <Tabs defaultValue="followers" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger className="w-full" value="followers">
                  Followers
                </TabsTrigger>
                <TabsTrigger className="w-full" value="following">
                  Following
                </TabsTrigger>
              </TabsList>
              <TabsContent className="w-full h-full" value="followers">
                <ScrollArea className="h-[50vh] rounded-xl bg-primary-foreground my-1 md:p-4 p-2 md:h-[60vh]">
                  <div className="w-full flex flex-col gap-2">
                    {isLoading ? (
                      <div className="text-center py-8 bg-secondary rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">
                          <Loader2 className="animate-spin" />
                        </h3>
                      </div>
                    ) : followers.length > 0 ? (
                      followers.map((e) => (
                        <div
                          key={e.user.id}
                          className="flex bg-popover justify-between items-center gap-2 p-2  rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                className="object-cover"
                                src={e.user.avatar}
                                alt={e.user.username}
                              />
                              <AvatarFallback>
                                {e.user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">
                              {e.user.username}
                            </h2>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center bg-secondary py-8 rounded-xl">
                        <h3 className="text-xl font-semibold mb-2">
                          No Followers Yet
                        </h3>
                        <p>
                          Share your posts and engage with others to build your
                          following!
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent className="w-full h-full" value="following">
                <ScrollArea className="h-[50vh] rounded-xl bg-primary-foreground my-1 p-2 md:p-4 md:h-[60vh]">
                  <div className="w-full flex flex-col gap-2">
                    {isLoading ? (
                      <div className="text-center py-8 bg-secondary rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">
                          <Loader2 className="animate-spin" />
                        </h3>
                      </div>
                    ) : following.length > 0 ? (
                      following.map((e) => (
                        <div
                          key={e.user.id}
                          className="flex bg-popover items-center  justify-between gap-4 p-2 rounded-lg"
                        >
                          <div className="flex items-center md:gap-4 gap-2">
                            <Avatar>
                              <AvatarImage
                                className="object-cover"
                                src={e.user.avatar}
                                alt={e.user.username}
                              />
                              <AvatarFallback>
                                {e.user.username[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <h2 className="text-lg font-semibold">
                              {e.user.username}
                            </h2>
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              onClick={() => unFollowUser(e.user.id)}
                            >
                              Unfollow
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-secondary rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">
                          Not Following Anyone
                        </h3>
                        <p className="">
                          Discover new people and start following them to see
                          their posts in your feed!
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowersDrawer;
