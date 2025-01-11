import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StoryProps {
  username: string;
  mediaURL: string;
}

export default function Story(story: StoryProps) {
  return (
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-full">
        <div className="absolute inset-[2px] bg-primary-foreground rounded-full"></div>
      </div>

      <Avatar className="absolute inset-[4px] w-[calc(100%-8px)] h-[calc(100%-8px)]">
        <AvatarImage
          src={story.mediaURL}
          alt={story.username}
          className="object-cover"
        />
        <AvatarFallback className="uppercase">
          {story.username[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
