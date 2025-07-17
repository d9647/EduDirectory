import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Bookmark, Plus, ChevronDown, Settings, LogOut } from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/tutoring-providers", label: "Tutoring Providers" },
    { href: "/summer-camps", label: "Summer Camps" },
    { href: "/internships", label: "Internships" },
    { href: "/jobs", label: "Jobs" },
  ];

  const isActiveRoute = (href: string) => location === href;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold text-primary cursor-pointer">EduPages</h1>
              </Link>
            </div>
            
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                      isActiveRoute(item.href)
                        ? "bg-primary-50 text-primary-700 border border-primary-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" asChild>
              <Link href="/bookmarks">
                <Bookmark className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Saved</span>
              </Link>
            </Button>
            
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/submit-listing">
                <Plus className="h-4 w-4 mr-1" />
                List Your Service
              </Link>
            </Button>

            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 hover:bg-gray-100 rounded-md p-2 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || ""} alt={user.firstName || user.email || ""} className="object-cover" />
                    <AvatarFallback>
                      {(user.firstName || user.email || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm text-gray-700">
                    {user.firstName || user.email}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <Badge variant="secondary" className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => window.location.href = "/api/logout"}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={`block px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                    isActiveRoute(item.href)
                      ? "bg-primary-50 text-primary-700 border border-primary-200"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
