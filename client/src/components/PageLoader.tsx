import { motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

export default function PageLoader() {
  const controls = useAnimationControls();

  useEffect(() => {
    const animateLoader = async () => {
      await controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 360],
        opacity: [1, 0.5, 1],
        transition: {
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        },
      });
    };

    animateLoader();
  }, [controls]);

  return (
    <div className="flex items-center justify-center h-screen bg-black w-full">
      <motion.img
        className="w-20 h-20"
        src="/logo.svg"
        alt="Loading..."
        animate={controls}
        initial={{ scale: 1, rotate: 0 }}
      />
    </div>
  );
}
