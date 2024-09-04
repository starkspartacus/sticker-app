"use client";

import React, { useState } from "react";
import UploadPictureAndVideo from "./uploadPictureAndVideo";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface MiniatureUploadProps {
  files: File[];
  stickerUrl: string | null;
}

const MiniatureUpload: React.FC<MiniatureUploadProps> = ({
  files,
  stickerUrl,
}) => {
  const [filesState, setFilesState] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesChange = (newFiles: File[]) => {
    setFilesState(newFiles);
    generateThumbnails(newFiles);
  };

  const generateThumbnails = (files: File[]) => {
    const newThumbnails: string[] = [];
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.currentTime = 1;

        video.onloadeddata = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          newThumbnails.push(canvas.toDataURL());
          setThumbnails([...newThumbnails]);
        };

        video.onerror = () => {
          console.error("Failed to load video for thumbnail generation");
        };
      } else {
        newThumbnails.push(URL.createObjectURL(file));
        setThumbnails([...newThumbnails]);
      }
    });
  };

  const handleThumbnailClick = (thumbnail: string) => {
    setSelectedFile(thumbnail);
  };

  const closeModal = () => {
    setSelectedFile(null);
  };

  const addStickerAndZipFiles = async () => {
    if (!stickerUrl || filesState.length === 0) return;

    setIsProcessing(true);

    const zip = new JSZip();
    const stickerImage = await fetch(stickerUrl).then((res) => res.blob());

    filesState.forEach((file, index) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const stickerImg = document.createElement("img");
            stickerImg.src = URL.createObjectURL(stickerImage);
            stickerImg.onload = () => {
              ctx.drawImage(stickerImg, 0, 0, 100, 100);

              canvas.toBlob((blob) => {
                if (blob) {
                  zip.file(`file_with_sticker_${index + 1}.png`, blob);
                  if (index === filesState.length - 1) {
                    zip
                      .generateAsync({ type: "blob" })
                      .then((content: Blob) => {
                        saveAs(content, "files_with_stickers.zip");
                        setIsProcessing(false);
                      });
                  }
                }
              });
            };
          }
        };
      };
      fileReader.readAsDataURL(file);
    });
  };

  return (
    <div>
      <UploadPictureAndVideo onFilesChange={handleFilesChange} />
      <div className="flex space-x-4 mt-4">
        {thumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className="w-24 h-24 rounded-md overflow-hidden cursor-pointer"
            onClick={() => handleThumbnailClick(thumbnail)}
          >
            <Image
              src={thumbnail}
              alt={`preview-${index}`}
              className="w-full h-full object-cover"
              width={18}
              height={18}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addStickerAndZipFiles}
        className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Add Sticker and Zip Files"}
      </button>

      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <button
              className="absolute top-2 right-2 text-white"
              onClick={closeModal}
            >
              X
            </button>
            {selectedFile.startsWith("data:video/") ? (
              <video
                src={selectedFile}
                controls
                className="max-w-full max-h-full"
                autoPlay
              />
            ) : (
              <Image
                src={selectedFile}
                alt="Selected preview"
                className="max-w-full max-h-full"
                width={800}
                height={800}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniatureUpload;
