"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function DemoSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Section Images */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">Personnalisez vos images</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Ajoutez facilement des stickers à vos images. Positionnez-les où vous voulez, ajustez
              leur taille, et exportez le résultat en quelques clics.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Interface intuitive de glisser-déposer</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Collection de stickers prédéfinis</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Export en haute qualité</span>
              </li>
            </ul>
            <Link href="/images" className="block sm:inline-block">
              <Button className="w-full sm:w-auto gap-2">
                <ImageIcon className="w-4 h-4" />
                Essayer maintenant
              </Button>
            </Link>
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-2xl" />
            <img
              src="/images/interface.png"
              alt="Éditeur d'images"
              className="rounded-xl border-2 border-muted shadow-2xl relative w-full"
            />
          </motion.div>
        </motion.div>

        {/* Section Vidéos */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur-2xl" />
            <img
              src="/images/interface.png"
              alt="Éditeur de vidéos"
              className="rounded-xl border-2 border-muted shadow-2xl relative w-full"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-6 order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-bold">Animez vos vidéos</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Donnez vie à vos vidéos en ajoutant des stickers animés. Contrôlez leur position et
              leur taille tout au long de la vidéo.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Prévisualisation en temps réel</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Traitement rapide</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>Export au format MP4</span>
              </li>
            </ul>
            <Link href="/videos" className="block sm:inline-block">
              <Button className="w-full sm:w-auto gap-2">
                <VideoIcon className="w-4 h-4" />
                Essayer maintenant
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
