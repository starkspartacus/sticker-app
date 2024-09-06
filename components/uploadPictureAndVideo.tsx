"use client";

import React, { useState } from "react";

interface UploadPictureAndVideoProps {
  onFilesChange: (files: File[]) => void;
}

const UploadPictureAndVideo: React.FC<UploadPictureAndVideoProps> = ({ onFilesChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles([...files, ...Array.from(event.dataTransfer.files)]);
      onFilesChange([...files, ...Array.from(event.dataTransfer.files)]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md">
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Upload Images and Vidéos
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div
        className="border-dashed border-2 border-gray-400 p-4 rounded-md text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        or drop files here
      </div>
    </div>
  );
};

export default UploadPictureAndVideo;
