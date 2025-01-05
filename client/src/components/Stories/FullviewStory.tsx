import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StoryData {
  username: string;
  avatarUrl: string;
  imageUrl: string;
  duration: number;
}

export default function FullViewStory() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const story: StoryData = {
    username: "user1",
    avatarUrl:
      "http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg",
    imageUrl: "https://source.unsplash.com/random/1080x1920",
    duration: 5000, // 5 seconds
  };

  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setProgress((oldProgress) => {
  //         if (oldProgress === 100) {
  //           clearInterval(timer)
  //           return 100
  //         }
  //         return Math.min(oldProgress + 1, 100)
  //       })
  //     }, story.duration / 100)

  //     return () => {
  //       clearInterval(timer)
  //     }
  //   }, [story.duration])

  //   useEffect(() => {
  //     if (progress === 100) {
  //       onClose()
  //     }
  //   }, [progress, onClose])

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* User info */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={story.avatarUrl} alt={story.username} />
          <AvatarFallback>{story.username[0]}</AvatarFallback>
        </Avatar>
        <span className="text-white font-semibold">{story.username}</span>
      </div>

      <button
        onClick={() => navigate("/", { replace: true })}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <X size={24} />
      </button>

      {/* Story content */}
      <img
        src={story.imageUrl}
        alt="Story content"
        className="h-96 object-cover"
      />
    </div>
  );
}
