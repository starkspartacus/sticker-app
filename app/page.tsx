"use client";

import ButtonAddStickerOnFiles from "@/components/ButtonAddStickerOnFiles";
import PositionSticker from "@/components/PositionSticker";

import UploadPictureAndVideo from "@/components/uploadPictureAndVideo";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [stickerPosition, setStickerPosition] = useState<{
    x: number;
    y: number;
  }>({
    x: 50,
    y: 50,
  });
  const [stickerSize, setStickerSize] = useState<number>(100); // Taille par défaut du sticker (100px)
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [stickerImage, setStickerImage] = useState<File | null>(null); // Update type to File | null

  const handleFilesChange = (files: File[]) => {
    setFiles(files);
  };

  return (
    <>
      <div className="">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome to App Sticker
        </h1>
        <div className="card p-4 border rounded-md shadow-md"></div>

        {stickerUrl && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Sticker à insérer</h2>
            <Image
              src={stickerUrl}
              alt="Sticker Preview"
              width={100}
              height={100}
            />
          </div>
        )}

        <div>
          <PositionSticker
            onStickerChange={(newSticker) => {
              if (newSticker instanceof File) {
                const url = URL.createObjectURL(newSticker);
                setStickerUrl(url);
                setStickerImage(newSticker); // Update logic to set File
              } else {
                setStickerUrl(newSticker);
                setStickerImage(null); // Handle non-File case
              }
            }}
            onPositionChange={(newPosition) => setStickerPosition(newPosition)}
          />
        </div>

        <div>
          <UploadPictureAndVideo onFilesChange={handleFilesChange} />
        </div>

        <div>
          <ButtonAddStickerOnFiles
            stickerUrl={stickerUrl}
            files={files}
            stickerPosition={stickerPosition}
            stickerSize={stickerSize}
            videoFile={videoFile}
            stickerImage={stickerImage}
            position={stickerPosition} // Fix: replace 'position' with 'stickerPosition'
          />
        </div>
      </div>
    </>
  );
}
