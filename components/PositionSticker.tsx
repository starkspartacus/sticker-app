"use client";

import React, { useState } from "react";
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
    x: 0,
    y: 0,
  });
  const [sticker, setSticker] = useState<File | null>(null);

  const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newPosition = { ...position, [name]: parseInt(value, 10) };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const handleStickerChange = (files: File[]) => {
    const newSticker = files.length > 0 ? files[0] : null;
    setSticker(newSticker);
    onStickerChange(newSticker);
  };

  const positionOptions = [
    { label: "En haut", value: { x: 0, y: 0 } },
    { label: "En bas", value: { x: 0, y: 100 } },
    { label: "Au centre", value: { x: 50, y: 50 } },
    { label: "En bas centré", value: { x: 50, y: 100 } },
    { label: "En haut très à gauche", value: { x: 0, y: 0 } },
    // Ajoutez d'autres options ici
  ];

  const handlePositionSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPosition = JSON.parse(event.target.value);
    setPosition(selectedPosition);
    onPositionChange(selectedPosition);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md">
      <UploadSticker onFilesChange={handleStickerChange} />
      <label className="mb-2 mt-4">Position du Sticker</label>
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
    </div>
  );
};

export default PositionSticker;
