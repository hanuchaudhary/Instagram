import ReelCard from "@/components/Reel/ReelCard";
import { reelsSelector } from "@/store/atoms/ReelsAtom";
import { useRecoilValueLoadable } from "recoil";

export default function ReelsPage() {
  const reelsLoadable = useRecoilValueLoadable(reelsSelector);

  return (
    <div className="">
      <div className="max-w-sm flex py-4 flex-col gap-4 mx-auto">
        {reelsLoadable.state === "loading" && <div>Loading...</div>}
        {reelsLoadable.state === "hasError" && (
          <div>Error loading reels. Please try again later.</div>
        )}
        {reelsLoadable.state === "hasValue" &&
          reelsLoadable.contents.map((reel) => (
            <ReelCard {...reel} key={reel.id} />
          ))}
      </div>
    </div>
  );
}
