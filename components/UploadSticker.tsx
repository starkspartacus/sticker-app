"use client";

import React, { useState } from "react";

interface UploadStickerProps {
  onStickerChange: (file: File | null, size: number) => void;
}

const UploadSticker: React.FC<UploadStickerProps> = ({ onStickerChange }) => {
  const [sticker, setSticker] = useState<File | null>(null);
  const [size, setSize] = useState(100); // Taille par défaut du sticker (100px)

  const handleStickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const newSticker = event.target.files[0];
      setSticker(newSticker);
      onStickerChange(newSticker, size);
    }
  };

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value);
    setSize(newSize);
    if (sticker) {
      onStickerChange(sticker, newSize); // Mettre à jour la taille du sticker
    }
  };

  const handleRemoveSticker = () => {
    setSticker(null);
    onStickerChange(null, size); // Réinitialiser le sticker à null
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg p-6 border rounded-md shadow-md">
        {/* Upload du sticker */}
        {!sticker ? (
          <>
            <label
              htmlFor="sticker-upload"
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
            >
              Upload Sticker
            </label>
            <input
              id="sticker-upload"
              type="file"
              accept="image/*" // On accepte uniquement les images pour les stickers
              className="hidden"
              onChange={handleStickerChange}
            />
          </>
        ) : (
          <div className="flex flex-col items-center">
            <img
              src={URL.createObjectURL(sticker)}
              alt="Uploaded Sticker"
              style={{ width: `${size}px`, height: `${size}px` }}
              className="mb-4"
            />
            {/* Contrôle de la taille du sticker */}
            <label htmlFor="size-slider" className="mb-2">
              Sticker Size: {size}px
            </label>
            <input
              id="size-slider"
              type="range"
              min="50"
              max="1000"
              value={size}
              onChange={handleSizeChange}
              className="mb-4"
            />

            {/* Bouton pour supprimer et remplacer le sticker */}
            <div className="flex space-x-2">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={handleRemoveSticker}
              >
                Remove Sticker
              </button>
              <label
                htmlFor="sticker-upload"
                className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Replace Sticker
              </label>
            </div>
            <input
              id="sticker-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleStickerChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSticker;
