"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  popular: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  variants?: Variants;
}

export function PricingCard({ plan, variants }: PricingCardProps) {
  return (
    <motion.div variants={variants}>
      <Card
        className={`relative p-8 h-full flex flex-col ${
          plan.popular ? "border-primary shadow-lg" : ""
        }`}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
            Populaire
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-bold">{plan.price}</span>
            {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
          </div>
          <p className="mt-2 text-muted-foreground">{plan.description}</p>
        </div>

        <ul className="space-y-3 mb-8 flex-grow">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Link href={plan.href} className="block mt-auto">
          <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
            {plan.cta}
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
