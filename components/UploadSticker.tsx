"use client";

import Image from "next/image";
import React, { useState } from "react";

interface UploadStickerProps {
  onStickerChange: (file: File | null, size: number) => void;
}

const UploadSticker: React.FC<UploadStickerProps> = ({ onStickerChange }) => {
  const [sticker, setSticker] = useState<File | null>(null);
  const [originalSticker, setOriginalSticker] = useState<File | null>(null);
  const [size, setSize] = useState(100); // Taille par défaut du sticker (100px)
  const [loading, setLoading] = useState(false);
  const [removeBg, setRemoveBg] = useState(false);

  const removeBackground = async (file: File): Promise<File | null> => {
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append("image_file", file);

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": "2UDa96fvsTuhKduNpX3Zfp79" },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        return new File([blob], file.name, { type: blob.type });
      } else {
        console.error("Error:", response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleStickerChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      const newSticker = event.target.files[0];
      setOriginalSticker(newSticker);
      const stickerWithNoBg = await removeBackground(newSticker);
      setLoading(false);

      if (stickerWithNoBg) {
        setSticker(stickerWithNoBg);
        onStickerChange(stickerWithNoBg, size);
      }
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
    setOriginalSticker(null);
    onStickerChange(null, size); // Réinitialiser le sticker à null
  };

  const toggleRemoveBg = () => {
    if (removeBg && originalSticker) {
      setSticker(originalSticker);
      onStickerChange(originalSticker, size);
    } else if (!removeBg && originalSticker) {
      removeBackground(originalSticker).then((stickerWithNoBg) => {
        if (stickerWithNoBg) {
          setSticker(stickerWithNoBg);
          onStickerChange(stickerWithNoBg, size);
        }
      });
    }
    setRemoveBg(!removeBg);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
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
              Télécharge un sticker
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
          <label htmlFor="size-slider" className="mb-2">
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
          />

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
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-md"
              onClick={toggleRemoveBg}
            >
              {removeBg
                ? "Restaurer l'arrière-plan"
                : "Supprimer l'arrière-plan"}
            </button>
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
