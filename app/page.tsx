"use client";

import ButtonAddStickerOnFiles from "@/components/ButtonAddStickerOnFiles";
import MiniatureImageUpload from "@/components/minuatureImageUpload";
import PositionSticker from "@/components/PositionSticker";
import PreviewStickerOnFile from "@/components/previewStickerOnFile";

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
  const [showPreview, setShowPreview] = useState<boolean>(false);

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

        {/* {stickerUrl && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Sticker à insérer</h2>
            <Image
              src={stickerUrl}
              alt="Sticker Preview"
              width={100}
              height={100}
            />
          </div>
        )} */}
        <div>
          <UploadPictureAndVideo onFilesChange={handleFilesChange} />
          <MiniatureImageUpload
            files={files} // Add this line to pass the files prop
          />
        </div>
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
            onPositionChange={(newPosition) => setStickerPosition(newPosition)}
          />
        </div>

        <div className="flex flex-row gap-4">
          <ButtonAddStickerOnFiles
            stickerUrl={stickerUrl}
            files={files}
            stickerPosition={stickerPosition}
            stickerSize={stickerSize}
          />
          {files.length > 0 && (
            <button
              onClick={() => setShowPreview(!showPreview)}
              className=" bg-yellow-400 rounded-md p-3 text-white"
            >
              {showPreview ? "Cacher la Preview" : "Pré-visualiser tout"}
            </button>
          )}
        </div>

        {showPreview && (
          <div className="flex flex-wrap gap-4 mt-4">
            {files.map((file, index) => (
              <PreviewStickerOnFile
                key={index}
                file={file}
                stickerUrl={stickerUrl}
                stickerPosition={stickerPosition}
                stickerSize={stickerSize}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
