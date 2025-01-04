import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export interface ReelVideoPlayerProps {
  mediaURL: string;
}

export default function ReelVideoPlayer({ mediaURL }: ReelVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState({
    isPlaying: false,
    isMuted: true,
    showControls: false,
  });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      } else {
        videoRef.current.pause();
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setPlayerState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && videoRef.current) {
        videoRef.current.pause();
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play();
          setPlayerState((prev) => ({
            ...prev,
            isPlaying: true,
            showControls: false,
          }));
        } else {
          video.pause();
          setPlayerState((prev) => ({ ...prev, isPlaying: false }));
        }
      },
      { threshold: 0.7 } // 70% of the video should be visible
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative z-[999999] bg-black w-full max-w-[1080px] mx-auto overflow-hidden aspect-[9/16]"
        onMouseEnter={() =>
          setPlayerState((prev) => ({ ...prev, showControls: true }))
        }
        onMouseLeave={() =>
          setPlayerState((prev) => ({ ...prev, showControls: false }))
        }
      >
        <video
          loop
          ref={videoRef}
          className="h-full w-full object-contain"
          src={mediaURL}
          onClick={togglePlayPause}
          muted={playerState.isMuted}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playerState.showControls || !playerState.isPlaying
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          <div
            onClick={togglePlayPause}
            className="text-white bg-black/50 cursor-pointer rounded-full p-4 hover:bg-black/70"
          >
            {playerState.isPlaying ? (
              <Pause fill="white" className="h-10 w-10" />
            ) : (
              <Play fill="white" className="h-10 w-10" />
            )}
          </div>
        </div>
        <div
          className={`absolute top-0 right-0 p-4 transition-opacity duration-300 ${
            playerState.showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <div onClick={toggleMute} className="text-white cursor-pointer">
              {playerState.isMuted ? (
                <VolumeX fill="white" className="h-6 w-6" />
              ) : (
                <Volume2 fill="white" className="h-6 w-6" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute z[1] blur-2xl opacity-50 inset-0 bg-gradient-to-br from-neutral-600 via-neutral-500 to-orange-400 animate-gradient-xy"></div>
    </div>
  );
}
