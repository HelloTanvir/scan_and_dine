"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import {
  LayoutDashboard,
  QrCode,
  ChefHat,
  BarChart3,
  Table2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  QrCode,
  ChefHat,
  BarChart3,
  Table2,
} as const;

interface NavItemProps {
  href: string;
  icon: keyof typeof iconMap;
  title: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const NavItem = React.memo(function NavItem({ 
  href, 
  icon, 
  title, 
  isCollapsed, 
  isActive 
}: NavItemProps) {
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150 hover:bg-green-100 dark:hover:bg-green-800",
        isActive 
          ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-50" 
          : "text-green-700 dark:text-green-400"
      )}
    >
      <Icon className="h-5 w-5" />
      {!isCollapsed && <span className="text-sm font-medium">{title}</span>}
    </Link>
  );
});

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = React.memo(function DashboardLayout({ 
  children 
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = useMemo(() => 
    NAVIGATION_ITEMS.map(item => ({
      ...item,
      isActive: pathname === item.href,
    })), 
    [pathname]
  );

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex min-h-screen bg-green-50 dark:bg-green-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col border-r border-green-200 dark:border-green-800 bg-white dark:bg-green-900 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-600 p-1">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold text-green-900 dark:text-green-50">
                Scan & Dine
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-2 flex-1">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon as keyof typeof iconMap}
              title={item.name}
              isCollapsed={isCollapsed}
              isActive={item.isActive}
            />
          ))}
        </nav>

        {/* Toggle button */}
        <div className="p-2 border-t border-green-200 dark:border-green-800">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b border-green-200 dark:border-green-800 bg-white dark:bg-green-900 px-6">
          <h1 className="text-xl font-semibold text-green-900 dark:text-green-50">
            Restaurant Dashboard
          </h1>
          <div className="ml-auto flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <Avatar>
                    <AvatarImage src="/placeholder-avatar.jpg" alt="Admin" />
                    <AvatarFallback className="bg-green-200 text-green-800">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin User</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500 flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;