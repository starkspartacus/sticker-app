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

const NavigationMenuComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md w-full">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center justify-start">
          <Image
            src="/logo/logo_stikker.png"
            alt="Logo"
            className=""
            width={150}
            height={150}
          />
          <span className="">
            <Image
              src="/logo/logo_app.png"
              alt="Logo"
              className=""
              width={120}
              height={99}
            />
          </span>
        </div>
        <nav className="hidden md:flex space-x-4 w-full justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            <Link href="/" className="block text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link
              href="/about"
              className="block text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavigationMenuComponent;
