"use client";

import { PricingCard } from "@/components/pricing-card";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Gratuit",
    price: "0€",
    description: "Pour les utilisateurs occasionnels",
    features: [
      "5 images par jour",
      "3 vidéos par jour",
      "Stickers de base",
      "Qualité standard",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    href: "/images",
    popular: false,
  },
  {
    name: "Pro",
    price: "9.99€",
    period: "/mois",
    description: "Pour les créateurs de contenu",
    features: [
      "Images illimitées",
      "Vidéos illimitées",
      "Tous les stickers",
      "Export haute qualité",
      "Support prioritaire",
      "Pas de filigrane",
      "Stickers personnalisés",
      "Animations avancées",
    ],
    cta: "Commencer l'essai gratuit",
    href: "/images",
    popular: true,
  },
  {
    name: "Entreprise",
    price: "Sur mesure",
    description: "Pour les équipes et entreprises",
    features: [
      "Tout le plan Pro",
      "Utilisateurs illimités",
      "API dédiée",
      "Support dédié 24/7",
      "Formation personnalisée",
      "Intégration personnalisée",
      "SLA garanti",
    ],
    cta: "Contacter les ventes",
    href: "mailto:sales@appsticker.com",
    popular: false,
  },
];

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

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center space-y-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">Tarifs simples et transparents</h1>
          <p className="text-xl text-muted-foreground">
            Choisissez le plan qui correspond à vos besoins
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {plans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} variants={itemVariants} />
          ))}
        </motion.div>

        <motion.div
          className="mt-20 text-center bg-muted p-8 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold mb-4">Vous avez des questions ?</h2>
          <p className="text-muted-foreground mb-6">
            Notre équipe est là pour vous aider à choisir le meilleur plan pour vos besoins.
          </p>
          <Button variant="outline" asChild>
            <Link href="mailto:support@appsticker.com">Contactez-nous</Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
