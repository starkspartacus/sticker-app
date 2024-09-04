"use client";

import ButtonAddStickerOnFiles from "@/components/ButtonAddStickerOnFiles";
import MiniatureUpload from "@/components/MinuiatureUpload";
import PositionSticker from "@/components/PositionSticker";
import UploadPictureAndVideo from "@/components/uploadPictureAndVideo";
import UploadSticker from "@/components/UploadSticker";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesChange = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setStickerUrl(url);
      setFiles(files); // Update the files state
    }
    console.log(files);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome to App Sticker
        </h1>
        <div className="card p-4 border rounded-md shadow-md">
          {/* <MiniatureUpload files={files} /> */}
        </div>
        <div>{/* <UploadSticker onFilesChange={handleFilesChange} /> */}</div>
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
              } else {
                setStickerUrl(newSticker);
              }
            }}
            onPositionChange={(newPosition) => console.log(newPosition)}
          />
        </div>
      </div>
      <div>
        <ButtonAddStickerOnFiles stickerUrl={stickerUrl} files={files} />
      </div>
    </>
  );
}
