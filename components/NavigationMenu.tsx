"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "./theme/ThemeToggle";
import { LuMenu } from "react-icons/lu";

const NavigationMenuComponent: React.FC = () => {
  return (
    <nav className="fixed mt-10 z-50 flex items-center justify-between w-full h-24 px-4 py-10 backdrop-blur-md bg-background bg-opacity-30 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <Link href="/">
        <Image
          alt="logo"
          className="w-40 cursor-pointer dark:invert"
          src="/logo/logo_stikker.png"
          height={100}
          width={170}
        />
      </Link>
      <div className="hidden gap-1 md:gap-2 lg:gap-4 md:flex">
        <Button variant="ghost" className="font-semibold text-md">
          <Link href="/">Accueil</Link>
        </Button>
        <Button variant="ghost" className="font-semibold text-md">
          <Link href="/about">A propos</Link>
        </Button>
        <Button variant="ghost" className="font-semibold text-md">
          <Link href="/prix">Tarifs</Link>
        </Button>
      </div>
      <div className="items-center hidden gap-2 md:flex">
        <ModeToggle />
        <Link href="">
          <Button
            variant="default"
            className="items-center hidden gap-2 bg-orange-600 rounded-full w-fit md:flex"
            size="lg"
          >
            <span>Github Repo</span>
            <span className="text-xl">
              <LuMenu />
            </span>
          </Button>
        </Link>
      </div>
      {/* MOBILE NAV */}
      <Sheet>
        <SheetTrigger className="block p-3 md:hidden">
          <span className="text-2xl text-slate-950 dark:text-slate-200">
            <LuMenu />
          </span>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetDescription>
              <div className="flex flex-col w-full h-full">
                <SheetTrigger asChild>
                  <Link href="/">
                    <Button
                      variant="link"
                      className="w-full font-semibold text-md"
                    >
                      Accueil
                    </Button>
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link href="/about">
                    <Button
                      variant="link"
                      className="w-full font-semibold text-md"
                    >
                      A propos
                    </Button>
                  </Link>
                </SheetTrigger>
                <SheetTrigger asChild>
                  <Link href="/prix">
                    <Button
                      variant="link"
                      className="w-full font-semibold text-md"
                    >
                      Tarifs
                    </Button>
                  </Link>
                </SheetTrigger>
                <ModeToggle />
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavigationMenuComponent;
