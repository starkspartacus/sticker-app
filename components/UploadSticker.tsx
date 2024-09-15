"use client";

import Image from "next/image";
import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UploadStickerProps {
  onStickerChange: (file: File | null, size: number) => void;
}

const UploadSticker: React.FC<UploadStickerProps> = ({ onStickerChange }) => {
  const [sticker, setSticker] = useState<File | null>(null);
  const [size, setSize] = useState(100); // Taille par défaut du sticker (100px)
  const [loading, setLoading] = useState(false);

  const handleStickerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      const newSticker = event.target.files[0];
      setSticker(newSticker);
      onStickerChange(newSticker, size);
      setLoading(false);
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

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        setLoading(true);
        const newSticker = event.dataTransfer.files[0];
        setSticker(newSticker);
        onStickerChange(newSticker, size);
        setLoading(false);
      }
    },
    [onStickerChange, size]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-4"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div
        className="relative w-full max-w-lg p-6 border rounded-md shadow-md"
        style={{ height: "377px", overflow: "hidden", width: "377px" }}
      >
        {/* Upload du sticker */}
        {!sticker ? (
          <>
            <label
              htmlFor="sticker-upload"
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
            >
              Télécharge un sticker ou glisse-le ici
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
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={URL.createObjectURL(sticker)}
              alt="Uploaded Sticker"
              style={{ width: `${size}px`, height: `${size}px` }}
              className="mb-4"
              priority={true}
              width={size}
              height={size}
            />
          </div>
        )}
      </div>

      {loading && <p>Loading...</p>}

      {sticker && (
        <div className="flex flex-col items-center mt-4">
          {/* Contrôle de la taille du sticker */}
          {/* <label htmlFor="size-slider" className="mb-2">
            Taille du sticker: {size}px
          </label>
          <input
            id="size-slider"
            type="range"
            min="50"
            max="500"
            value={size}
            onChange={handleSizeChange}
            className="mb-4"
          /> */}

          {/* Boutons pour supprimer et remplacer le sticker */}
          <div className="flex space-x-2">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md"
              onClick={handleRemoveSticker}
            >
              Supprimer
            </button>
            <label
              htmlFor="sticker-upload"
              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Remplacer
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
  );
};

export default UploadSticker;
