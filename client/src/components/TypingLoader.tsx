import { useEffect, useState } from "react";

export default function TypingLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((prev) => !prev);
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative inline-block">
      <div className="inline-block bg-secondary backdrop-filter backdrop-blur-lg rounded-2xl p-2 shadow-xl">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`
                h-2.5 w-2.5 
                bg-primary
                rounded-full
                animate-bounce 
                transition-all duration-500 ease-in-out
                ${visible ? "opacity-100 scale-100" : "opacity-40 scale-75"}
              `}
              style={{
                animationDelay: `${index * 0.2}s`,
                animationDuration: "1s", 
                transform: `scale(${visible ? 1 : 0.75})`,
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 0 12px rgba(var(--primary), 0.35)",
              }}
            />
          ))}
        </div>
      </div>
      <div 
        className="absolute -bottom-2 left-1 w-4 h-4 bg-secondary"
        style={{
          clipPath: "polygon(0 0, 100% 0, 0 100%)"
        }}
      />
    </div>
  );
}
