import SinglePostModal from "@/components/Post/SinglePostModal";
import { ReportButton } from "@/components/ReportButton";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SinglePostWrapper() {
  const navigate = useNavigate();
  const postId = window.location.pathname.split("/")[2];

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        navigate(-1);
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-foreground/75 p-4 md:p-0">
      <div className="fixed top-10 right-10 flex gap-5 z-20">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-primary/10 rounded-full hover:bg-primary/20 transition-colors"
        >
          <X className="text-primary" />
        </button>
        <ReportButton
          reportTargetTitle={postId}
          reportType="POST"
          reportedId={postId}
          postId={parseInt(postId)}
        />
      </div>
      <SinglePostModal />
    </div>
  );
}
