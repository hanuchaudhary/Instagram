import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/AuthStore/useAuthStore";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import {
  Compass,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  LayoutDashboard,
} from "lucide-react";
import Menu from "@/components/Menu";

export default function AppLayout() {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { fetchProfile, profile } = useProfileStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);

  const handleScrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const NavLink = ({
    to,
    icon: Icon,
    label,
  }: {
    to: string;
    icon: React.ElementType;
    label: string;
  }) => (
    <Link
      to={to}
      className={`flex items-center ${
        isCollapsed ? "" : "p-3"
      } rounded-xl transition-colors duration-200 hover:bg-accent ${
        location.pathname === to
          ? "bg-accent text-accent-foreground"
          : "text-foreground"
      }`}
    >
      <Icon
        className={`text-neutral-400 ${
          location.pathname != to ? "text-neutral-400" : "text-primary"
        } ${!isCollapsed ? "w-7 h-7 mr-4" : "h-10 w-10"} `}
      />
      <AnimatePresence>
        {!isCollapsed && (
          <span
            className={`text-lg text-neutral-400 ${
              location.pathname != to ? "text-neutral-400" : "text-primary"
            } font-medium overflow-hidden whitespace-nowrap`}
          >
            {isCollapsed ? "" : label}
          </span>
        )}
      </AnimatePresence>
    </Link>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? "5rem" : "18rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col justify-between border-r p-6 overflow-hidden"
      >
        <div className="space-y-6">
          <Link to="/" className="flex items-center mb-8">
            {isCollapsed ? (
              <img
                className="dark:invert"
                src="/instagram-logo.svg"
                alt="/instagram-logo.svg"
              />
            ) : (
              <img
                className="w-36 dark:invert"
                src="/text-logo.svg"
                alt="logo"
              />
            )}
          </Link>
          <nav className={`${isCollapsed ? "space-y-5" : "space-y-2"}`}>
            <NavLink to="/" icon={Home} label="Home" />
            <NavLink to="/explore" icon={Compass} label="Explore" />
            <NavLink to="/messages" icon={MessageCircle} label="Messages" />
            <NavLink to="/search" icon={Search} label="Search" />
            <NavLink to="/create" icon={PlusSquare} label="Create" />
            {/* <NavLink to="/reels" icon={Film} label="Reels" /> */}
            <Link
              className={`flex items-center ${
                !isCollapsed && "p-3"
              } rounded-xl transition-colors duration-200 hover:bg-accent ${
                location.pathname === "/reels"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground"
              }`}
              to={"/reels"}
            >
              <img
                typeof="image/svg+xml"
                src="/reelsIcon.svg"
                className={`dark:invert ${
                  location.pathname === "/reels" ? "opacity-100" : "opacity-50"
                } ${isCollapsed ? "w-10 h-10" : "w-7 h-7 mr-4"}`}
                alt=""
              />
              <h1
                className={`${
                  location.pathname === "/reels"
                    ? "text-primary"
                    : "text-neutral-400"
                }`}
              >
                <span
                  className={`text-lg font-medium overflow-hidden whitespace-nowrap ${
                    isCollapsed ? "hidden" : ""
                  }`}
                >
                  Reels
                </span>
              </h1>
            </Link>
            {profile?.role === "admin" && (
              <NavLink to="/admin" icon={LayoutDashboard} label="Dashboard" />
            )}
            <Link
              to="/profile"
              className={`flex items-center ${
                !isCollapsed && "p-3"
              } rounded-xl transition-colors duration-200 hover:bg-accent ${
                location.pathname === "/profile"
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground"
              }`}
            >
              <Avatar
                className={`${isCollapsed ? "w-10 h-10" : "w-7 h-7 mr-4"}`}
              >
                <AvatarImage
                  className="object-cover"
                  src={profile.avatar || authUser?.avatar || "/user.svg"}
                  alt="Profile"
                />
                <AvatarFallback>{authUser?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <h1
                className={`${
                  location.pathname === "/profile"
                    ? "text-primary"
                    : "text-neutral-400"
                }`}
              >
                {!isCollapsed && (
                  <span className="text-lg font-medium overflow-hidden whitespace-nowrap">
                    Profile
                  </span>
                )}
              </h1>
            </Link>
          </nav>
        </div>
        <div className="flex flex-col items">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-accent transition-colors duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="w-6 h-6" />
            ) : (
              <ChevronLeft className="w-6 h-6" />
            )}
          </button>
          <Menu />
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 h-screen overflow-hidden md:pb-0">
        <div
          onScroll={() => {
            if (scrollRef.current) {
              setIsScrollbarVisible(scrollRef.current.scrollTop > 100);
            }
          }}
          ref={scrollRef}
          className="h-full overflow-y-scroll"
        >
          <Outlet />
        </div>
        <AnimatePresence>
          {isScrollbarVisible && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              onClick={handleScrollToTop}
              className="fixed bottom-4 right-4 bg-accent text-accent-foreground p-2 rounded-full shadow-lg"
            >
              <ArrowUp />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden z-[99999999999] fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-16 px-4">
        <Link
          to="/"
          className={`p-2 rounded-full ${
            location.pathname === "/" ? "bg-accent" : ""
          }`}
        >
          <Home className="w-7 h-7" />
        </Link>
        <Link
          to="/messages"
          className={`p-2 rounded-full ${
            location.pathname === "/messages" ? "bg-accent" : ""
          }`}
        >
          <MessageCircle className="w-7 h-7" />
        </Link>
        <Link
          to="/create"
          className={`p-2 rounded-full ${
            location.pathname === "/create" ? "bg-accent" : ""
          }`}
        >
          <PlusSquare className="w-7 h-7" />
        </Link>
        <Link
          to="/search"
          className={`p-2 rounded-full ${
            location.pathname === "/search" ? "bg-accent" : ""
          }`}
        >
          <Search className="w-7 h-7" />
        </Link>
        <Link
          to="/reels"
          className={`p-2 rounded-full ${
            location.pathname === "/reels" ? "bg-accent" : ""
          }`}
        >
          {/* <Film className="w-7 h-7" /> */}
          <img
            src="/reelsIcon.svg"
            className="w-8 h-8 dark:invert-[1]"
            alt=""
          />
        </Link>
        <Link
          to="/profile"
          className={`p-2 rounded-full ${
            location.pathname === "/profile" ? "bg-accent" : ""
          }`}
        >
          <Avatar className="w-7 h-7">
            <AvatarImage
              className="object-cover"
              src={profile.avatar || authUser?.avatar || "/user.svg"}
              alt="Profile"
            />
            <AvatarFallback>{authUser?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </div>
  );
}
