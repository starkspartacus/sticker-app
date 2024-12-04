"use client";

import { cn } from "@/lib/utils";
import { Github, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={cn("mx-auto w-full max-w-screen-xl px-2.5 md:px-20")}>
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AppSticker</h3>
              <p className="text-sm text-muted-foreground">
                Une solution simple et rapide pour personnaliser vos images et vidéos avec des
                stickers.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/images" className="text-sm text-muted-foreground hover:text-primary">
                    Éditer des images
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="text-sm text-muted-foreground hover:text-primary">
                    Éditer des vidéos
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} StickerStudio. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
