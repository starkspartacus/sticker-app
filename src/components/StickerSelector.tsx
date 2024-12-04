"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_STICKERS = [
  "/stickers/star.png",
  "/stickers/smile.png",
  "/stickers/thumbs-up.jpg",
  "/stickers/fire.png",
  "/stickers/party.png",
];

interface StickerSelectorProps {
  onSelect: (sticker: string) => void;
  selected: string | null;
}

export default function StickerSelector({ onSelect, selected }: StickerSelectorProps) {
  const [customStickers, setCustomStickers] = useState<string[]>([]);

  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner une image");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomStickers((prev) => [...prev, result]);
        toast.success("Sticker ajouté avec succès");
      };
      reader.readAsDataURL(file);
    }
  };

  const StickerGrid = ({ stickers }: { stickers: string[] }) => (
    <div className="grid grid-cols-2 gap-4">
      {stickers.map((sticker, index) => (
        <Card
          key={`${sticker}-${index}`}
          className={cn(
            "p-2 cursor-pointer hover:bg-accent transition-colors",
            selected === sticker && "ring-2 ring-primary"
          )}
          onClick={() => onSelect(sticker)}
        >
          <img src={sticker} alt="Sticker" className="w-full aspect-square object-contain" />
        </Card>
      ))}
    </div>
  );

  return (
    <Tabs defaultValue="default" className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="default">Par défaut</TabsTrigger>
        <TabsTrigger value="custom">Personnalisés</TabsTrigger>
      </TabsList>

      <TabsContent value="default" className="mt-4">
        <ScrollArea className="h-[400px] pr-4">
          <StickerGrid stickers={DEFAULT_STICKERS} />
        </ScrollArea>
      </TabsContent>

      <TabsContent value="custom" className="mt-4">
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <label className="block">
              <Card className="p-4 cursor-pointer border-dashed hover:bg-accent transition-colors">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Ajouter un sticker</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleStickerUpload}
                  />
                </div>
              </Card>
            </label>

            {customStickers.length > 0 ? (
              <StickerGrid stickers={customStickers} />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Aucun sticker personnalisé
              </div>
            )}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
