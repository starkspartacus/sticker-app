"use client";

import { Toaster } from "@/components/ui/toaster";

import { SiteConfig } from "../src/site-config";

import PlausibleProvider from "next-plausible";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PlausibleProvider domain={SiteConfig.domain}>
        {children}
      </PlausibleProvider>
    </ThemeProvider>
  );
};
