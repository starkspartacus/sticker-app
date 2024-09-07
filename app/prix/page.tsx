"use client";

import React, { useState } from "react";
import ShinyButton from "@/components/magicui/shiny-button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

const PricingPage: React.FC = () => {
  const [selectedCredits, setSelectedCredits] = useState<number>(200);
  const [isAnnual, setIsAnnual] = useState<boolean>(false);

  const handleCreditChange = (credits: number) => {
    setSelectedCredits(credits);
  };

  const handleToggleChange = () => {
    setIsAnnual(!isAnnual);
  };

  const getPricePerImage = (credits: number) => {
    switch (credits) {
      case 40:
        return 0.23;
      case 200:
        return 0.2;
      case 500:
        return 0.18;
      case 1200:
        return 0.16;
      case 2800:
        return 0.14;
      default:
        return 0.2;
    }
  };

  const getMonthlyPrice = (credits: number) => {
    switch (credits) {
      case 40:
        return 9;
      case 200:
        return 39;
      case 500:
        return 89;
      case 1200:
        return 189;
      case 2800:
        return 389;
      default:
        return 39;
    }
  };

  const monthlyPrice = getMonthlyPrice(selectedCredits);
  const annualPrice = monthlyPrice * 12 * 0.9; // 10% discount for annual payment

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Obtenez des images en pleine résolution
      </h1>
      <p className="text-center text-gray-600 mb-4">
        1 IMAGE = 1 CRÉDIT ou moins
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
        {/* Pay as you go */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">
            Payer au fur et à mesure
          </h2>
          <ul className="space-y-2">
            <li>1 crédit - €0,90 / image</li>
            <li>10 crédits - €0,80 / image</li>
            <li>50 crédits - €0,70 / image</li>
            <li>100 crédits - €0,60 / image</li>
            <li>200 crédits - €0,50 / image</li>
          </ul>
          <ShinyButton
            text="Acheter maintenant"
            className="bg-blue-500 text-white mt-4 w-full"
          />
        </div>
        {/* Subscription */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Forfait</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Sélectionnez les crédits:
            </label>
            <div className="space-y-2">
              {[40, 200, 500, 1200, 2800].map((credits) => (
                <div key={credits}>
                  <input
                    type="radio"
                    id={`credits-${credits}`}
                    name="credits"
                    value={credits}
                    checked={selectedCredits === credits}
                    onChange={() => handleCreditChange(credits)}
                    className="mr-2"
                  />
                  <label htmlFor={`credits-${credits}`}>
                    {credits} crédits / mois - €
                    {getPricePerImage(credits).toFixed(2)} / image
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <label className="mr-2">Payer mensuellement</label>
            <ToggleSwitch checked={isAnnual} onChange={handleToggleChange} />
            <label className="ml-2">Payer annuellement (Économisez 10%)</label>
          </div>
          <p className="text-xl font-bold mb-4">
            €{isAnnual ? annualPrice.toFixed(2) : monthlyPrice.toFixed(2)} /{" "}
            {isAnnual ? "an" : "mois"}
          </p>
          <ShinyButton
            text="S'abonner maintenant"
            className="bg-green-500 text-white mt-4 w-full"
          />
        </div>
        {/* High Volume Solutions */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Solutions haut volume</h2>
          <p className="text-gray-600 mb-4">Plus de 100 000 images / an</p>
          <ul className="space-y-2">
            <li>Meilleures garanties sur mesure</li>
            <li>API flexible, Limites de débit et intégration</li>
            <li>Support dédié et SLA</li>
          </ul>
          <ShinyButton
            text="Contacter le service commercial"
            className="bg-yellow-500 text-white mt-4 w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
