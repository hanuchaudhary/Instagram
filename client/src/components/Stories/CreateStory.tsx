import { useState, ChangeEvent, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import { useStoriesStore } from "@/store/StoriesStore/useStoriesStore";
import { useNavigate } from "react-router-dom";

export default function CreateStory() {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const { profile } = useProfileStore();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { createStory, isCreatingStory } = useStoriesStore();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64Image = fileReader.result as string;
        setImage(base64Image);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      image,
    });

    if (!image) return;
    await createStory({ mediaURL: image, caption: text }, navigate);
    setImage(null);
    setText("");
  };

  return (
    <div className="space-y-4  md:p-4 p-2 md:mb-0 mb-14">
      <h2 className="text-2xl font-bold">Create Your Story</h2>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="image-upload" className="block mb-2">
              <Button
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                <Camera className="mr-2 h-4 w-4" /> Upload Image
              </Button>
            </label>
            <Input
              ref={inputRef}
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="story-text" className="block mb-2">
              Add Text to Your Story
            </label>
            <Textarea
              id="story-text"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter your story text here..."
              className="w-full"
            />
          </div>
          <p className="text-sm text-neutral-500 mb-4">
            Drag the text in the preview to position it on your story.
          </p>
          <Button
            type="submit"
            variant="default"
            disabled={isCreatingStory}
            className="w-full"
          >
            {isCreatingStory ? "Creating Story" : "Create Story"}
          </Button>
        </form>

        <div className="relative w-full h-[500px] bg-secondary rounded-lg overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="Story preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-neutral-400">Upload an image to see preview</p>
            </div>
          )}
          {text && (
            <h1 className="absolute bottom-6 left-1/2 -translate-x-1/2 p-2 z-10 bg-black/50 rounded-lg  text-white">
              {text}
            </h1>
          )}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                className="object-coverhom"
                src={profile.avatar || "/user.svg"}
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold text-sm">
              {profile.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
