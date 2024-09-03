"use client";

import React, { useState, useEffect } from "react";
import UploadPictureAndVideo from "./uploadPictureAndVideo";
import Image from "next/image";

const MiniatureUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    generateThumbnails(newFiles);
  };

  const generateThumbnails = (files: File[]) => {
    const newThumbnails: string[] = [];
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.currentTime = 1; // Capture the thumbnail at 1 second

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
