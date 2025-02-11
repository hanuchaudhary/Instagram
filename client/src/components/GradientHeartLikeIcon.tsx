export function GradientHeartLikeIcon() {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        opacity={0.9}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="instagram-heart" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="50%" stopColor="#FF0169" />
            <stop offset="100%" stopColor="#D300C5" />
          </linearGradient>
        </defs>
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          fill="url(#instagram-heart)"
          stroke="none"
        />
      </svg>
    )
  }
  