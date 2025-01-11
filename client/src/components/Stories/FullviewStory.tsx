import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";
import { useEffect } from "react";

export default function FullViewStory() {
  const navigate = useNavigate();
  const { stories, fetchStories, currentUserWithStory } = useStoriesStore();
  const { username } = useParams();

  const location = useLocation();
  const state = location.state;

  useEffect(() => {
    fetchStories(username as string);
  }, [fetchStories, currentUserWithStory]);

  const story = stories[0];
  const handleNextStory = () => {
    console.log("Next Story");
  };

  const handlePreviousStory = () => {
    console.log("Previous Story");
  };

  return (
    <div className="h-screen relative flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 h-1 w-full bg-neutral-500">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          // style={{ width: `${progress}%` }}
        />
      </div>
      <Link
        to={"/"}
        replace
        className="absolute top-4 right-4 text-white hover:text-neutral-300"
      >
        <X size={24} />
      </Link>
      <div className="slider px-40 flex justify-between w-full absolute">
        <button
          onClick={handlePreviousStory}
          className="bg-secondary disabled:bg-secondary/50 disabled:text-secondary cursor-pointer h-14 w-14 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="h-8 w-8" />
        </button>
        <button
          onClick={handleNextStory}
          className="bg-secondary disabled:bg-secondary/50 disabled:text-secondary cursor-pointer h-14 w-14 rounded-full flex items-center justify-center"
        >
          <ArrowRight className="h-8 w-8" />
        </button>
      </div>
      <div className="relative bg-secondary h-[600px] w-96">
        <div className="absolute p-2 flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              className="object-cover"
              src={story.User.avatar}
              alt={story.User.username}
            />
            <AvatarFallback>{story.User.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold">
            {story.User.username}
          </span>
        </div>
        <div className="bg-neutral-700 h-full w-full">
          <img
            className="h-full w-full object-cover"
            src={story.mediaURL}
            alt=""
          />
        </div>
        {story.caption && (
          <h1 className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 z-10 bg-black/50 rounded-lg  text-white">
            {story.caption}
          </h1>
        )}
      </div>
    </div>
  );
}
