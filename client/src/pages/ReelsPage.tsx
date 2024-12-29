import { useEffect, useRef, useCallback } from "react";
import { useReelsStore } from "@/store/ReelsStore/useReelsStore";
import ReelCard from "@/components/Reel/ReelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Film } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ReelsPage() {
  const { reels, isLoading, error, hasMore, fetchReels } = useReelsStore();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastReelElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchReels();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, fetchReels]
  );

  useEffect(() => {
    fetchReels();
  }, []);

  // const scrollToTop = () => {
  //   console.log("Scroll position:", window.scrollY);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <div className="container relative mx-auto px-4 py-8">
      {/* <div
        className="fixed md:flex bottom-4 right-4 h-16 w-16 bg-secondary/30 hidden items-center justify-center rounded-full cursor-pointer"
        onClick={scrollToTop}
      >
        <ArrowUp className="h-10 w-10" />
      </div> */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Reels</h1>
        <p className="text-muted-foreground">
          Discover and watch short, engaging videos
        </p>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {reels.length === 0 && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center bg-secondary/30 rounded-xl p-8 text-center">
          <Film className="h-16 w-16 mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-semibold mb-2">No reels found</h2>
          <p className="text-muted-foreground max-w-md">
            It looks like there aren't any reels yet. Be the first to create and
            share an exciting reel!
          </p>
        </div>
      )}

      {reels.length > 0 && (
        <div className="md:w-96 mx-auto space-y-3">
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              ref={index === reels.length - 1 ? lastReelElementRef : null}
            >
              <ReelCard {...reel} />
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="space-y-4 mt-4">
          {[...Array(3)].map((_, index) => (
            <Skeleton
              key={index}
              className="md:w-96 mx-auto space-y-3 h-[400px] rounded-xl"
            />
          ))}
        </div>
      )}
    </div>
  );
}
