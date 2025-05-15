import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  Users,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/auth";
import axios from "@/api/axios-instance";

export function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Acceuil",
      href: "/",
      active: pathname === "/",
    },
    {
      icon: FileText,
      label: "Projets",
      href: "/projects",
      active: pathname === "/projects",
    },
    // {
    //   icon: PlusCircle,
    //   label: "Ajouter un projet",
    //   href: "/add-project",
    //   active: pathname === "/add-project",
    // },
    {
      icon: Users,
      label: "Utilisateurs",
      href: "/utilisateurs",
      active: pathname === "/utilisateurs",
      allowedRoles: ["Administrateur"],
    },
  ];

  async function logout() {
    try {
      await axios.post("/users/logout", null, {
        withCredentials: true,
      });

      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  }

  if (userLoading) return <></>;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-8">
          {/* Logo / Titre de l'application */}
          <div className="flex items-center flex-1 lg:flex-none">
            <Link to="/" className="flex items-center">
              <img src="/logo.jpg" alt="ORMVAG" className="w-20" />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="flex-1 hidden lg:flex items-center lg:justify-center space-x-4">
            {navItems
              .filter((item) => {
                // Show item if no allowedRoles or if user's role is allowed
                return (
                  !item.allowedRoles || item.allowedRoles.includes(user.role)
                );
              })
              .map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-2 py-2 text-xs font-medium transition-colors",
                    item.active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                >
                  {/* Uncomment if you want icons:
                    <item.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        item.active
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-500"
                      )}
                    /> */}
                  <span>{item.label}</span>
                </Link>
              ))}
          </nav>

          {/* User Profile & Mobile Menu Button */}
          <div className="flex items-center">
            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 relative h-8 w-8 rounded-full cursor-pointer text-sm font-medium text-gray-500">
                  {user?.fname[0]}
                  {user?.lname[0]}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.fname} {user?.lname}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profil")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/profil")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden ml-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={
                  mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"
                }
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    item.active
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.active
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              ))}
              {/* <button
                className="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span>Déconnexion</span>
              </button> */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
