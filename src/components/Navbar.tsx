"use client";

import { cn } from "@/lib/utils";
import { LoginLink, LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { CreditCard, Home, ImageIcon, Menu, VideoIcon, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useKindeBrowserClient();

  const publicNavigation = [
    {
      name: "Accueil",
      href: "/",
      icon: Home,
      current: pathname === "/",
    },
    {
      name: "Images",
      href: "/images",
      icon: ImageIcon,
      current: pathname === "/images",
    },
    {
      name: "Vidéos",
      href: "/videos",
      icon: VideoIcon,
      current: pathname === "/videos",
    },
    {
      name: "Tarifs",
      href: "/pricing",
      icon: CreditCard,
      current: pathname === "/pricing",
    },
  ];

  const privateNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard",
    },
    {
      name: "Tarifs",
      href: "/pricing",
      icon: CreditCard,
      current: pathname === "/pricing",
    },
  ];

  const navigation = isAuthenticated ? privateNavigation : publicNavigation;

  return (
    <nav className="sticky inset-x-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all">
      <div className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20")}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
                <span className="text-xl font-bold">AppSticker</span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button variant={item.current ? "default" : "ghost"} className="gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              {isAuthenticated ? (
                <LogoutLink postLogoutRedirectURL="/">
                  <Button variant="outline">Déconnexion</Button>
                </LogoutLink>
              ) : (
                <LoginLink>
                  <Button>Connexion</Button>
                </LoginLink>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1 border-t">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                <Button
                  variant={item.current ? "default" : "ghost"}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
            {isAuthenticated ? (
              <LogoutLink postLogoutRedirectURL="/">
                <Button variant="outline" className="w-full justify-start">
                  Déconnexion
                </Button>
              </LogoutLink>
            ) : (
              <LoginLink>
                <Button className="w-full justify-start">Connexion</Button>
              </LoginLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
