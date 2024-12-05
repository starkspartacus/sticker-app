"use client";

import DemoSection from "@/components/demo-section";
import FeaturesSection from "@/components/features-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { motion } from "framer-motion";
import { ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useKindeBrowserClient();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <div>
        <section className="relative bg-gradient-to-b from-primary/5 to-background py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div
            className={cn(
              "mx-auto w-full max-w-screen-xl px-2.5 md:px-20 mb-12 mt-28 sm:mt-14 flex flex-col items-center justify-center text-center"
            )}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <motion.div
                className="text-center space-y-6 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
                >
                  Donnez vie à vos médias avec des stickers animés
                </motion.h1>
                <motion.p
                  className="text-lg sm:text-xl text-muted-foreground px-4 sm:px-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Une solution simple et rapide pour personnaliser vos images et
                  vidéos. Ajoutez des stickers, exportez et partagez en quelques
                  clics.
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href="/images" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Commencer avec les images
                    </Button>
                  </Link>
                  <Link href="/videos" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto gap-2"
                    >
                      <VideoIcon className="w-5 h-5" />
                      Commencer avec les vidéos
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-16 px-4 sm:px-0"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div>
                  <div className="relative mx-auto max-w-4xl">
                    <div className="mt-16 flow-root sm:mt-24">
                      <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                        <video
                          width="1364"
                          height="866"
                          autoPlay
                          className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                        >
                          <source src="/videos/accueil.mp4" type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <FeaturesSection />
        <DemoSection />
      </div>
    </>
  );
}
