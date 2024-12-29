import { useEffect, useRef} from "react";
import ReelCard from "@/components/Reel/ReelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Film, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFetchReelsStore } from "@/hooks/useFetchReelsStore";

export default function ReelsPage() {
  const { reels, isLoading, error, hasMore, fetchReels } = useFetchReelsStore();
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchReels();
  }, []);

  console.log(reels);
  

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchReels();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [fetchReels, isLoading, hasMore]);

  return (
    <div className="container relative mx-auto px-4 py-8">
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
          {reels.map((reel) => (
            <div key={reel.id}>
              <ReelCard {...reel} />
            </div>
          ))}
          <div ref={observerRef} />
          {isLoading && (
            <div className="flex justify-center mt-4">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {!hasMore && (
            <div className="end-message my-4 bg-secondary/30 rounded-xl p-4">
              <h1 className="text-center text-sm font-semibold text-muted-foreground">
                No more reels to show
              </h1>
            </div>
          )}
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
