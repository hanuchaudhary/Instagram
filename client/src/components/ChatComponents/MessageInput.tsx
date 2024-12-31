import { Image, Send, X } from "lucide-react";
import { Input } from "../ui/input";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { useChatStore } from "@/store/ChatStore/useChatStore";

export default function MessageInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { sendMessage } = useChatStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!text && !imagePreview) {
      return;
    }

    try {
      sendMessage({
        message: text,
        image: imagePreview!,
      });
      setText("");
      setImagePreview(null);
    } catch (error) {
      toast.error("Failed to send message");
      console.log(error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) {
      toast.error("Invalid file type. Please upload an image.");
      return;
    }
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64Image = fileReader.result as string;
        setImagePreview(base64Image);
      };
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full relative">
      {imagePreview && (
        <div className="absolute left-0 bottom-10">
          <img
            src={imagePreview}
            alt="preview"
            className="w-44 object-cover rounded-lg"
          />
          <div
            onClick={() => {
              setImagePreview(null);
              fileInputRef &&
                fileInputRef.current &&
                (fileInputRef.current.value = "");
            }}
            className="absolute top-0 right-0"
          >
            <X />
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`${imagePreview ? "text-blue-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <button disabled={!text} type="submit">
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
