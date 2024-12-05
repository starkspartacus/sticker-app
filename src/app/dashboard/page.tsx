import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/db"; // Assurez-vous que le chemin est correct vers votre `db/index.ts`
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ImageIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Utiliser Prisma pour récupérer les informations utilisateur
  let dbUser = await db.user.findFirst({
    where: {
      id: user.id, // Correspond à l'ID de l'utilisateur de Kinde
    },
  });

  // Si l'utilisateur n'existe pas dans la base de données, l'ajouter
  if (!dbUser) {
    console.log(
      "Utilisateur non trouvé dans la base de données. Création de l'utilisateur..."
    );
    dbUser = await db.user.create({
      data: {
        id: user.id, // ID de l'utilisateur Kinde
        email: user.email || "", // Email récupéré depuis Kinde
      },
    });
    console.log("Utilisateur créé :", dbUser);
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl font-bold">
              Bienvenue, {user?.given_name}
            </h1>
            <p className="text-xl text-muted-foreground">
              Que souhaitez-vous personnaliser aujourd&apos;hui ?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card pour les images */}
            <div>
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Images</h2>
                <p className="text-muted-foreground">
                  Ajoutez des stickers à vos images en quelques clics.
                  Personnalisez la taille et la position selon vos besoins.
                </p>
                <br />
                <Link href="/images" className="block">
                  <Button className="w-full">Commencer avec les images</Button>
                </Link>
              </Card>
            </div>

            {/* Card pour les vidéos */}
            <div>
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <VideoIcon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">Vidéos</h2>
                <p className="text-muted-foreground">
                  Donnez vie à vos vidéos avec des stickers animés. Contrôlez
                  leur apparence tout au long de la vidéo.
                </p>
                <br />
                <Link href="/videos" className="block">
                  <Button className="w-full">Commencer avec les vidéos</Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
