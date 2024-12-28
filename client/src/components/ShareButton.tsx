import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ShareButton() {
  const [isCopied, setIsCopied] = useState(false);

  const handleShare = async () => {
    const profileUrl = window.location.href

    try {
      await navigator.clipboard.writeText(profileUrl);
      setIsCopied(true);
      toast.success(`Link copied to clipboard`);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button
      onClick={handleShare}
      className="relative overflow-hidden"
      aria-label={isCopied ? "Copied to clipboard" : "Share profile link"}
    >
      <AnimatePresence mode="wait">
        {!isCopied ? (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </motion.div>
        ) : (
          <motion.div
            key="copied"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center"
          >
            <Check className="mr-2 h-4 w-4" />
            Copied
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
