import Menu from "@/components/Menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Compass,
  Home,
  MessageCircle,
  PlusSquare,
  User,
  Search,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex justify-between flex-col md:max-w-64 lg:max-w-xs border-r p-4">
        <div>
          <Link to="/" className="flex items-center mb-10">
            <img
              className="w-36 dark:invert-[1] "
              src="https://pnghq.com/wp-content/uploads/pnghq.com-instagram-logo-splatter-p-7.png"
              alt="Instagram"
            />
          </Link>
          <nav className="space-y-4">
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === "/" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link className="text-xl py-6" to="/">
                <Home className="mr-2 h-10 w-10" /> Home
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === "/explore" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link className="text-xl py-6" to="/explore">
                <Compass className="mr-2 h-10 w-10" /> Explore
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === "/messages" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link className="text-xl py-6" to="/messages">
                <MessageCircle className="mr-2 h-10 w-10" /> Messages
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === "/search" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link className="text-xl py-6" to="/search">
                <Search className="mr-2 h-10 w-10" /> Search
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === "/create" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link className="text-xl py-6" to="/create">
                <PlusSquare className="mr-2 h-10 w-10" /> Create
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start ${
                location.pathname === "/profile" ? "bg-accent" : ""
              }`}
              asChild
            >
              <Link className="text-xl py-6" to="/profile">
                <User className="mr-2 h-10 w-10" /> Profile
              </Link>
            </Button>
          </nav>
        </div>
        <div>
          <Menu />
        </div>
      </aside>

      {/* Main content */}
      <main className="w-full h-[100vh] overflow-hidden pb-16 md:pb-0">
        <ScrollArea className=" h-full">
          <Outlet />
        </ScrollArea>
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center h-16">
        <Button
          variant="ghost"
          size="icon"
          className={location.pathname === "/" ? "bg-accent" : ""}
          asChild
        >
          <Link to="/">
            <Home className="h-8 w-8" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          className={`${location.pathname === "/messages" ? "bg-accent" : ""}`}
          asChild
        >
          <Link className="text-xl py-6" to="/messages">
            <MessageCircle className="h-8 w-8" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={location.pathname === "/create" ? "bg-accent" : ""}
          asChild
        >
          <Link to="/create">
            <PlusSquare className="h-8 w-8" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={location.pathname === "/search" ? "bg-accent" : ""}
          asChild
        >
          <Link to="/search">
            <Search className="h-8 w-8" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={location.pathname === "/profile" ? "bg-accent" : ""}
          asChild
        >
          <Link to="/profile">
            <User className="h-8 w-8" />
          </Link>
        </Button>
        <div>
          <Menu />
        </div>
      </nav>
    </div>
  );
}
