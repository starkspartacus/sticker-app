"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import UploadSticker from "./UploadSticker";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes"; // Assurez-vous d'avoir un hook pour détecter le thème

interface PositionStickerProps {
  onStickerChange: (sticker: File | null) => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: number) => void;
}

const PositionSticker: React.FC<PositionStickerProps> = ({
  onStickerChange,
  onPositionChange,
  onSizeChange,
}) => {
  const { theme } = useTheme(); // Utilisez le hook pour obtenir le thème actuel
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 50,
    y: 50,
  });
  const [sticker, setSticker] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [size, setSize] = useState<number>(100); // Default size for sticker in pixels
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [toastId, setToastId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Restore position and size from localStorage
    const savedPosition = localStorage.getItem("stickerPosition");
    const savedSize = localStorage.getItem("stickerSize");

    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }

    if (savedSize) {
      setSize(parseInt(savedSize, 10));
    }
  }, []);

  useEffect(() => {
    console.log("Position actuelle:", position);

    if ((position.x > 90 || position.y > 90) && toastId === null) {
      const id = toast({
        title: "Attention",
        description:
          "Le sticker ne sera pas visible sur votre image. Merci de rester dans la limite.",
        variant: "warning",
      }).id;
      setToastId(id);
    } else if (position.x <= 90 && position.y <= 90 && toastId !== null) {
      toast({
        title: "Position",
        description: "Position dans les limites recommandées.",
      });
      setToastId(null);
    } else if (toastId !== null) {
      toast({
        title: "Position",
        description: "Position dans les limites recommandées.",
      });
    }
  }, [position, toastId, toast]);

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

  const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(event.target.value, 10);
    setSize(newSize);
    onSizeChange(newSize);
    localStorage.setItem("stickerSize", newSize.toString());

    if (toastId === null) {
      const id = toast({
        title: "Taille du sticker",
        description: `Taille du sticker: ${newSize}px`,
        variant: "info",
      }).id;
      setToastId(id);
    } else {
      toast({
        title: "Taille du sticker",
        description: `Taille du sticker: ${newSize}px`,
      });
    }
  };

  const handlePositionChange = (axis: "x" | "y", value: number) => {
    const newPosition = {
      ...position,
      [axis]: value,
    };
    setPosition(newPosition);
    onPositionChange(newPosition);
    localStorage.setItem("stickerPosition", JSON.stringify(newPosition));
  };

  const constrainedPosition = {
    x: Math.min(Math.max(position.x, 0), 100),
    y: Math.min(Math.max(position.y, 0), 100),
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md ">
      <UploadSticker onStickerChange={handleStickerChange} />

      {previewUrl ? (
        <div
          className={`relative mt-4 mb-4 w-full h-64 border rounded-md overflow-hidden ${
            theme === "light" ? "bg-gray-200" : ""
          } flex items-center justify-center`}
        >
          <div
            className="absolute"
            style={{
              left: `${constrainedPosition.x}%`,
              top: `${constrainedPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Image
              src={previewUrl}
              alt="Sticker Preview"
              width={size}
              height={size}
              priority={true}
              className="sticker-image"
            />
          </div>
        </div>
      ) : (
        <div
          className={`mt-4 mb-4 w-1/2 md:w-full h-96 border rounded-md overflow-hidden ${
            theme === "light" ? "bg-gray-200" : ""
          } flex items-center justify-center`}
        >
          <p className="dark:text-white text-gray-700">
            Aucun autocollant n&lsquo;a été téléchargé. Veuillez en télécharger
          </p>
        </div>
      )}

      <label className="mb-2 mt-4 font-semibold text-gray-700 dark:text-white">
        Position du Sticker
      </label>

      <div className="flex flex-col mt-4 md:w-full">
        <label className="text-gray-700 dark:text-white">
          Position horizontale (X)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.x}
          onChange={(e) => handlePositionChange("x", parseInt(e.target.value))}
          className="mt-2 range-input"
        />
        <label className="text-gray-700 mt-4 dark:text-white">
          Position verticale (Y)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={position.y}
          onChange={(e) => handlePositionChange("y", parseInt(e.target.value))}
          className="mt-2 range-input"
        />
        <label className="text-gray-700 mt-4 dark:text-white">
          Taille du Sticker (px)
        </label>
        <input
          type="range"
          min="1"
          max="500"
          value={size}
          onChange={handleSizeChange}
          className="mt-2 range-input"
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-md">
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              onClick={closeModal}
            >
              Close
            </button>
            <div className="relative w-full h-full">
              <Image
                src={previewUrl || ""}
                alt="Modal Preview"
                layout="fill"
                objectFit="contain"
                className="max-w-full max-h-full"
                style={{
                  position: "absolute",
                  left: `${constrainedPosition.x}%`,
                  top: `${constrainedPosition.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionSticker;
