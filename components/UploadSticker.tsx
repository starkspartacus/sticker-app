"use client";

import React, { useState } from "react";

// Interface for the component props
interface UploadStickerProps {
  onFilesChange: (files: File[]) => void;
}

// UploadSticker component
const UploadSticker: React.FC<UploadStickerProps> = ({ onFilesChange }) => {
  // State to store the uploaded files
  const [files, setFiles] = useState<File[]>([]);

  // Function to handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      // Convert FileList to an array and update state
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
      // Call the onFilesChange prop with the new files
      onFilesChange([...files, ...newFiles]);
    }
  };

  // Function to handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      // Convert FileList to an array and update state
      setFiles([...files, ...Array.from(event.dataTransfer.files)]);
      // Call the onFilesChange prop with the new files
      onFilesChange([...files, ...Array.from(event.dataTransfer.files)]);
    }
  };

  // Function to handle drag over event
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 border rounded-md shadow-md">
      {/* Label for file input */}
      <label
        htmlFor="sticker-upload"
        className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
      >
        Upload Stickers
      </label>
      {/* Hidden file input */}
      <input
        id="sticker-upload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      {/* Drop area for files */}
      <div
        className="border-dashed border-2 border-gray-400 p-4 rounded-md text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        or drop stickers here
      </div>
    </div>
  );
};

export default UploadSticker;
