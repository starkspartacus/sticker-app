import PositionSticker from "@/components/PositionSticker";
import React, { useState } from "react";

export const PositionStickerFile = () => {
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [stickerPosition, setStickerPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 50,
    y: 50,
  });
  return (
    <>
      <div className="mt-4">
        <PositionSticker
          onStickerChange={(newSticker) => {
            if (newSticker instanceof File) {
              const url = URL.createObjectURL(newSticker);
              setStickerUrl(url);
            } else {
              setStickerUrl(newSticker);
            }
          }}
          onPositionChange={(newPosition) => setStickerPosition(newPosition)}
          onSizeChange={(newSize) => setStickerSize(newSize)} // Ajout de la gestion de la taille
        />
      </div>
    </>
  );
};
