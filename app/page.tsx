"use client";

import ButtonAddStickerOnFiles from "@/components/ButtonAddStickerOnFiles";
import MiniatureImageUpload from "@/components/minuatureImageUpload";
import PositionSticker from "@/components/PositionSticker";
import PreviewStickerOnFile from "@/components/previewStickerOnFile";
import UploadPictureAndVideo from "@/components/uploadPictureAndVideo";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import "tailwind-scrollbar-hide";
import { UploadMediaAndFiles } from "@/src/features/uploadFiles/UploadMediaAndFiles";

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
  const [stickerSize, setStickerSize] = useState<number>(100); // Size in pixels
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isToggled, setIsToggled] = useState(false);

  const handleStickerChange = (file: File | null, size: number) => {
    if (file) {
      setStickerUrl(URL.createObjectURL(file));
    } else {
      setStickerUrl(null);
    }
    setStickerSize(size);
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <>
      {/* <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Welcome to App Sticker
      </h1>
      <div className="card p-4 border rounded-md shadow-md mb-4">
        <button onClick={handleToggle} className="btn btn-primary">
          Toggle
        </button>
        {isToggled && <p>The toggle is ON</p>}
      </div> */}
      <div className="p-4">
        <UploadMediaAndFiles />

        <div className="flex flex-row gap-4 mt-4">
          <ButtonAddStickerOnFiles
            stickerUrl={stickerUrl}
            files={files}
            stickerPosition={stickerPosition}
            stickerSize={stickerSize} // Passer la taille du sticker
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
