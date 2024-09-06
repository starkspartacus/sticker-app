"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import UploadSticker from "./UploadSticker";

interface PositionStickerProps {
  onStickerChange: (sticker: File | null) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const PositionSticker: React.FC<PositionStickerProps> = ({
  onStickerChange,
  onPositionChange,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [sticker, setSticker] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [size, setSize] = useState<number>(0); // New state for sticker size

  // Met à jour l'URL de prévisualisation chaque fois que le sticker change
  useEffect(() => {
    if (sticker) {
      const url = URL.createObjectURL(sticker);
      setPreviewUrl(url);

      // Nettoie l'URL lorsque le composant est démonté ou que le sticker change
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null); // Remet l'URL à null si aucun sticker n'est sélectionné
    }
  }, [sticker]);

  const handleStickerChange = (file: File | null, size: number) => {
    // Update handleStickerChange to accept size parameter
    setSticker(file);
    onStickerChange(file); // Pass the file to the parent component
    setSize(size); // Set the size of the sticker
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    onPositionChange(newPosition); // Informe le composant parent de la nouvelle position
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md bg-white">
      <UploadSticker onStickerChange={handleStickerChange} />

      {/* Zone de prévisualisation du sticker */}
      {previewUrl ? (
        <div className="relative mt-4 mb-4 w-full h-64 border rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          <Image
            src={previewUrl}
            alt="Sticker Preview"
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)", // Centrer le sticker selon la position
              position: "absolute",
            }}
            width={size} // Update width to use the size state
            height={size} // Update height to use the size state
            priority={true}
          />
        </div>
      ) : (
        <div className="mt-4 mb-4 w-1/2 md:w-full h-64 border rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">
            Aucun autocollant n&lsquo;a été téléchargé. Veuillez en télécharger
            un
          </p>
        </div>
      )}

      {/* Contrôle pour ajuster la position du sticker */}
      <label className="mb-2 mt-4 font-semibold text-gray-700">
        Position du Sticker
      </label>

      <div className="flex flex-col mt-4 md:w-full">
        <label className="text-gray-700">Position horizontale (X)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.x}
          onChange={(e) => handlePositionChange("x", parseInt(e.target.value))}
          className="mt-2"
        />
        <label className="text-gray-700 mt-4">Position verticale (Y)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.y}
          onChange={(e) => handlePositionChange("y", parseInt(e.target.value))}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default PositionSticker;
