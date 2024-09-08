"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [size, setSize] = useState<number>(100); // Default size for sticker

  useEffect(() => {
    console.log("Position actuelle:", position);
    if (position.x > 90 || position.y > 90) {
      toast.warn(
        "Attention, le sticker ne sera pas visible sur votre image. Merci de rester dans la limite.",
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  }, [position]);

  useEffect(() => {
    if (sticker) {
      const url = URL.createObjectURL(sticker);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [sticker]);

  const handleStickerChange = (file: File | null) => {
    setSticker(file);
    onStickerChange(file);
  };

  const handleSizeChange = (value: number) => {
    setSize(value);
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    const newPosition = {
      ...position,
      [axis]: value,
    };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const constrainedPosition = {
    x: Math.min(Math.max(position.x, size / 6 / 3.2), 100 - size / 2 / 3.2),
    y: Math.min(Math.max(position.y, size / 2 / 3.2), 100 - size / 2 / 3.2),
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md bg-white">
      <UploadSticker onStickerChange={handleStickerChange} />

      {previewUrl ? (
        <div className="relative mt-4 mb-4 w-full h-64 border rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          <div
            className="absolute"
            style={{
              left: `${constrainedPosition.x}%`,
              top: `${constrainedPosition.y}%`,
              right: `${constrainedPosition.x}`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={previewUrl}
              alt="Sticker Preview"
              width={size}
              height={size}
              priority={true}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 mb-4 w-1/2 md:w-full h-96 border rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">
            Aucun autocollant n&lsquo;a été téléchargé. Veuillez en télécharger
          </p>
        </div>
      )}

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
          className="mt-2 range-input"
        />
        <label className="text-gray-700 mt-4">Position verticale (Y)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.y}
          onChange={(e) => handlePositionChange("y", parseInt(e.target.value))}
          className="mt-2 range-input"
        />
        <label className="text-gray-700 mt-4">Taille du Sticker</label>
        <input
          type="range"
          min="10"
          max="200"
          value={size}
          onChange={(e) => handleSizeChange(parseInt(e.target.value))}
          className="mt-2 range-input"
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default PositionSticker;
