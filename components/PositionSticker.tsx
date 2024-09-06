"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import UploadSticker from "./UploadSticker";

interface PositionStickerProps {
  onStickerChange: (sticker: File | null) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

const PositionSticker: React.FC<PositionStickerProps> = ({ onStickerChange, onPositionChange }) => {
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

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md bg-white">
      <UploadSticker onFilesChange={handleStickerChange} />

      {previewUrl && (
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
            width={100}
            height={100}
            priority={true}
          />
        </div>
      )}

      <label className="mb-2 mt-4 font-semibold text-gray-700">Position du Sticker</label>

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
