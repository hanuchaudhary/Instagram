import React, { useState, ChangeEvent, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

export default function CreateStory() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleTextDrag = (e: React.DragEvent<HTMLDivElement>) => {
    const storyPreview = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - storyPreview.left) / storyPreview.width) * 100;
    const y = ((e.clientY - storyPreview.top) / storyPreview.height) * 100;
    setTextPosition({ x, y });
  };

  return (
    <div className="space-y-4  p-4">
      <h2 className="text-2xl font-bold">Create Your Story</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
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
        </div>

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
            <div
              className="absolute p-2 bg-black bg-opacity-50 text-white rounded cursor-move"
              style={{
                left: `${textPosition.x}%`,
                top: `${textPosition.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              draggable
              onDrag={handleTextDrag}
            >
              {text}
            </div>
          )}
          <div className="absolute top-4 left-4 flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src="http://res.cloudinary.com/diihvllmt/image/upload/v1736060254/instagram-clone/avatars/wytuchxg8vbqsrali2en.jpg"
                alt="User"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-white font-semibold text-sm">
              Your Username
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
