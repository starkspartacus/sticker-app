import MiniatureImageUpload from "@/components/minuatureImageUpload";
import UploadPictureAndVideo from "@/components/uploadPictureAndVideo";
import { motion } from "framer-motion";
import { files } from "jszip";
import React, { useState } from "react";

export const UploadMediaAndFiles = () => {
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());
  const [stickerUrl, setStickerUrl] = useState<string | null>(null);
  const [stickerSize, setStickerSize] = useState<number>(100); // Size in pixels
  const [files, setFiles] = useState<File[]>([]);

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
  return (
    <>
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
    </>
  );
};
