import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";

export default function FullViewStory() {
  const navigate = useNavigate();
  const { currentStoryId, stories, setCurrentStoryId } = useStoriesStore();
  console.log(currentStoryId);

  const story = stories[currentStoryId];

  const handleNextStory = () => {
    if (stories.length === currentStoryId + 1) return;
    setCurrentStoryId(currentStoryId + 1);
    navigate(`/story/${currentStoryId}`, { replace: true });
  };

  const handlePreviousStory = () => {
    if (currentStoryId === 0) return;
    setCurrentStoryId(currentStoryId - 1);
    navigate(`/story/${currentStoryId}`, { replace: true });
  };

  return (
    <div className="h-screen relative flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 h-1 w-full bg-neutral-500">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          // style={{ width: `${progress}%` }}
        />
      </div>
      <button
        onClick={() => navigate("/", { replace: true })}
        className="absolute top-4 right-4 text-white hover:text-neutral-300"
      >
        <X size={24} />
      </button>
      <div className="slider px-40 flex justify-between w-full absolute">
        <button
          disabled={currentStoryId === 0}
          onClick={handlePreviousStory}
          className="bg-secondary disabled:bg-secondary/50 disabled:text-secondary cursor-pointer h-14 w-14 rounded-full flex items-center justify-center"
        >
          <ArrowLeft className="h-8 w-8" />
        </button>
        <button
          disabled={stories.length === currentStoryId + 1}
          onClick={handleNextStory}
          className="bg-secondary disabled:bg-secondary/50 disabled:text-secondary cursor-pointer h-14 w-14 rounded-full flex items-center justify-center"
        >
          <ArrowRight className="h-8 w-8" />
        </button>
      </div>
      <div className="relative bg-secondary h-[600px] w-96">
        <div className="absolute p-2 flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={story.mediaURL} alt={story.username} />
            <AvatarFallback>{story.username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-white font-semibold">{story.username}</span>
        </div>
        <div className="bg-neutral-700 h-full w-full">
          <img
            className="h-full w-full object-cover"
            src={story.mediaURL}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
