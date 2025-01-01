import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/store/AuthStore/useAuthStore";
import { useProfileStore } from "@/store/UserStore/useProfileStore";
import {
  Compass,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  Film,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Menu from "@/components/Menu";

export default function AppLayout() {
  const location = useLocation();
  const { authUser } = useAuthStore();
  const { fetchProfile } = useProfileStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
                className="w-36 dark:invert"
                src="/instagram-logo.svg"
                alt="/instagram-logo.svg"
              />
            ) : (
              <img
                className="w-36 dark:invert"
                src="https://pnghq.com/wp-content/uploads/pnghq.com-instagram-logo-splatter-p-7.png"
                alt="/instagram-logo.svg"
              />
            )}
          </Link>
          <nav className={`${isCollapsed ? "space-y-5" : "space-y-2"}`}>
            <NavLink to="/" icon={Home} label="Home" />
            <NavLink to="/explore" icon={Compass} label="Explore" />
            <NavLink to="/messages" icon={MessageCircle} label="Messages" />
            <NavLink to="/search" icon={Search} label="Search" />
            <NavLink to="/create" icon={PlusSquare} label="Create" />
            <NavLink to="/reels" icon={Film} label="Reels" />
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
                  src={authUser?.avatar || "/user.svg"}
                  alt="Profile"
                />
                <AvatarFallback>{authUser?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-lg font-medium overflow-hidden whitespace-nowrap"
                  >
                    Profile
                  </motion.span>
                )}
              </AnimatePresence>
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
      <main className="flex-1 h-screen overflow-hidden  md:pb-0">
        <ScrollArea className="h-full">
          <Outlet />
        </ScrollArea>
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-16 px-4">
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
            location.pathname === "/search" ? "bg-accent" : ""
          }`}
        >
          <Film className="w-7 h-7" />
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
              src={authUser?.avatar || "/user.svg"}
              alt="Profile"
            />
            <AvatarFallback>{authUser?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
      </nav>
    </div>
  );
}
