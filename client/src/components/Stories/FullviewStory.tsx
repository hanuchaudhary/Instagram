import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTimeAgo } from "@/lib/getTimeFormat";

export default function FullViewStory() {
  const { stories, isFetchingStories, fetchStories } = useStoriesStore();
  const { username } = useParams();
  const navigate = useNavigate();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = useMemo(
    () => stories[currentStoryIndex],
    [stories, currentStoryIndex]
  );

  const fetchStoriesCallback = useCallback(() => {
    if (username) {
      fetchStories(username);
    }
  }, [fetchStories, username]);

  useEffect(() => {
    fetchStoriesCallback();
  }, [fetchStoriesCallback]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 10000) {
        setProgress((prevProgress) => prevProgress + 1);
      } else {
        handleNextStory();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [progress]);

  const handleNextStory = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prevIndex) => prevIndex + 1);
      setProgress(0);
    } else {
      navigate("/", { replace: true });
    }
  }, [currentStoryIndex, stories.length, navigate]);

  const handlePreviousStory = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prevIndex) => prevIndex - 1);
      setProgress(0);
    }
  }, [currentStoryIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNextStory();
      } else if (event.key === "ArrowLeft") {
        handlePreviousStory();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextStory, handlePreviousStory]);

  if (isFetchingStories) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg">No stories available.</p>
      </div>
    );
  }

  return (
    <div className="h-screen relative flex items-center justify-center bg-black">
      <div className="absolute z-50 top-0 left-0 w-full flex">
        {stories.map((story, index) => (
          <div key={story.id} className="h-1 flex-1 mr-1 bg-neutral-500">
            <div
              className="h-full bg-white transition-all duration-50 ease-linear"
              style={{
                width:
                  index === currentStoryIndex
                    ? `${progress}%`
                    : index < currentStoryIndex
                    ? "100%"
                    : "0%",
              }}
            />
          </div>
        ))}
      </div>
      <Link
        to="/"
        replace
        className="absolute top-4 z-50 right-4 text-white hover:text-neutral-300"
      >
        <X size={24} />
      </Link>
      <div className="slider z-50 px-2 sm:px-10 md:px-20 lg:px-40 flex justify-between w-full absolute">
        <Button
          variant="secondary"
          size="icon"
          onClick={handlePreviousStory}
          disabled={currentStoryIndex === 0}
          className="h-14 w-14 rounded-full"
        >
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleNextStory}
          disabled={currentStoryIndex === stories.length - 1}
          className="h-14 w-14 rounded-full"
        >
          <ArrowRight className="h-8 w-8" />
        </Button>
      </div>
      <div className="relative bg-neutral-950 md:h-[700px] h-full max-w-full">
        {currentStory && (
          <div className="flex flex-col h-full">
            <div className="absolute z-30 top-0 left-0 p-2 flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  className="object-cover"
                  src={currentStory.User.avatar}
                  alt={currentStory.User.username}
                />
                <AvatarFallback>{currentStory.User.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-white font-semibold leading-none">
                  {currentStory.User.username}
                </span>
                <span className="text-xs text-primary/60 leading-none">
                  {getTimeAgo(currentStory.createdAt)}
                </span>
              </div>
            </div>
          <div className="h-full max-w-lg rounded-xl flex items-center justify-center">
              <img
                className="max-h-full w-full z-20 object-contain"
                src={currentStory.mediaURL}
                alt=""
              />
              <img
                className="absolute rounded-xl blur-3xl max-h-full max-w-full object-contain"
                src={currentStory.mediaURL}
                alt=""
              />
            </div>
            {currentStory.caption && (
              <div className="absolute z-30 bottom-6 left-1/2 -translate-x-1/2 p-2 bg-black/50 rounded-lg text-white max-w-[90%] text-center">
                <p>{currentStory.caption}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
