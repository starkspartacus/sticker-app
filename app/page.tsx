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
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());

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
        <div className="flex flex-col md:flex-row justify-around items-start gap-4 w-full">
          <motion.div
            className="flex-1"
            initial={{ x: 0 }}
            animate={{ x: files.length > 0 ? -20 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <UploadPictureAndVideo
              onStickerChange={handleStickerChange}
              onFilesChange={handleFilesChange}
            />
          </motion.div>
          <motion.div
            className="flex-1 overflow-x-auto overflow-y-auto scrollbar-hide grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            transition={{ duration: 0.5 }}
            style={{ maxHeight: "400px" }} // Ajout de la hauteur maximale
          >
            {files.map((file, index) => (
              <motion.div
                key={index}
                className="w-24 h-24"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <MiniatureImageUpload
                  files={[file]}
                  processedFiles={processedFiles}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="mt-4">
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
            onSizeChange={(newSize) => setStickerSize(newSize)} // Ajout de la gestion de la taille
          />
        </div>

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
