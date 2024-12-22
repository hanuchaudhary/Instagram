import ReelCard from "@/components/Reel/ReelCard";
import { useReelsStore } from "@/store/ReelsStore/useReelsStore";
import { useEffect } from "react";

export default function ReelsPage() {
  const { fetchReels, isLoading, reels } = useReelsStore();

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  return (
    <div className="">
      <div className="max-w-sm flex py-4 flex-col gap-4 mx-auto">
        <h1 className="text-xl">Reels</h1>
        {isLoading && <div>Loading...</div>}
        {reels.length === 0 ? (
          <div className="h-full w-full flex items-center bg-secondary/30 rounded-xl p-6 justify-center">
            <h1 className="text-2xl text-neutral-500 font-semibold">
              No reels found. Please add some reels to see them here.
            </h1>
          </div>
        ) : (
          reels.map((reel) => <ReelCard {...reel} key={reel.id} />)
        )}
      </div>
    </div>
  );
}
