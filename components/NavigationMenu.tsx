"use client";

import React from "react";
import Link from "next/link";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { ThemeToggle } from "./theme/ThemeToggle";

const NavigationMenuComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md w-full static">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center justify-start">
            <Link href="/">
              <Image
                src="/logo/logo_stikker.png"
                alt="Logo"
                className=""
                width={150}
                height={150}
              />
            </Link>
            <span className="">
              <Link href="/">
                <Image
                  src="/logo/logo_app.png"
                  alt="Logo"
                  className=""
                  width={120}
                  height={99}
                />
              </Link>
            </span>
          </div>
          <nav className="hidden md:flex space-x-4 w-full justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Accueil
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      A propos
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/prix" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Tarifs
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <ThemeToggle />
          </nav>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <nav className="px-2 pt-2 pb-4 space-y-1">
              <Link
                href="/"
                className="block text-gray-700 hover:text-gray-900"
              >
                Accueil
              </Link>
              <Link
                href="/about"
                className="block text-gray-700 hover:text-gray-900"
              >
                A propos
              </Link>
              <Link
                href="/prix"
                className="block text-gray-700 hover:text-gray-900"
              >
                Tarifs
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default NavigationMenuComponent;
