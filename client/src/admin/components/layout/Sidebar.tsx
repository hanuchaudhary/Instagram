import React from "react";
import { LayoutDashboard, Users, Shield, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const router = useLocation();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Content Moderation", href: "/admin/moderation", icon: Shield },
    { name: "System Logs", href: "/admin/logs", icon: FileText },
  ];

  return (
    <div className="bg-card text-card-foreground w-64 border-r space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <h1 className="text-3xl font-semibold text-center">Admin Panel</h1>
      <nav>
        {navItems.map((item) => (
          <Link
            replace
            key={item.name}
            to={item.href}
            className={`flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              router.pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
