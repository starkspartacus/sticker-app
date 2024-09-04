"use client";

import React, { useState, useEffect } from "react";
import UploadSticker from "./UploadSticker";
import Image from "next/image";

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

  useEffect(() => {
    if (sticker) {
      const url = URL.createObjectURL(sticker);
      setPreviewUrl(url);
    }
  }, [sticker]);

  const handleStickerChange = (files: File[]) => {
    const newSticker = files.length > 0 ? files[0] : null;
    setSticker(newSticker);
    onStickerChange(newSticker);
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    const newPosition = { ...position, [axis]: value };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const positionOptions = [
    { label: "En haut à gauche", value: { x: 0, y: 0 } },
    { label: "En haut à droite", value: { x: 100, y: 0 } },
    { label: "En bas à gauche", value: { x: 0, y: 100 } },
    { label: "En bas à droite", value: { x: 100, y: 100 } },
    { label: "Au centre", value: { x: 50, y: 50 } },
    { label: "En bas centré", value: { x: 50, y: 100 } },
    { label: "En haut centré", value: { x: 50, y: 0 } },
  ];

  const handlePositionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPosition = JSON.parse(event.target.value);
    setPosition(selectedPosition);
    onPositionChange(selectedPosition);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md bg-white">
      <UploadSticker onFilesChange={handleStickerChange} />

      {previewUrl && (
        <div className="relative mt-4 mb-4 w-full h-64 border rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          {/* Conteneur de prévisualisation */}
          <Image
            src={previewUrl}
            alt="Sticker Preview"
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: "translate(-50%, -50%)", // Centrer le sticker selon la position
              position: "absolute", // Assurer un positionnement absolu
            }}
            width={100}
            height={100}
            priority={true}
          />
        </div>
      )}

      <label className="mb-2 mt-4 font-semibold text-gray-700">
        Position du Sticker
      </label>

      <select
        onChange={handlePositionSelect}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {positionOptions.map((option) => (
          <option key={option.label} value={JSON.stringify(option.value)}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="flex flex-col mt-4 w-full">
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
