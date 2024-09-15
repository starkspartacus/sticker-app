"use client";

import React, { useState } from "react";
import { BorderBeam } from "@/components/magicui/border-beam"; // Assurez-vous que BorderBeam est bien importé

interface UploadPictureAndVideoProps {
  onFilesChange: (files: File[]) => void;
  onStickerChange: (file: File | null, size: number) => void;
}

const UploadPictureAndVideo: React.FC<UploadPictureAndVideoProps> = ({
  onFilesChange,
  onStickerChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles([...files, ...newFiles]);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      const newFiles = Array.from(event.dataTransfer.files);
      setFiles([...files, ...newFiles]);
      onFilesChange([...files, ...newFiles]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Fonction pour supprimer un fichier
  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  // Use onStickerChange where necessary
  // For example, when a file is uploaded:
  const handleFileUpload = (file: File) => {
    const size = 100; // Example size, replace with actual logic
    onStickerChange(file, size);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Utilisation correcte de BorderBeam */}
      <div className="relative w-full max-w-lg p-6 border rounded-md shadow-md">
        <BorderBeam
          colorFrom={files.length > 0 ? "#00FF5E" : "#ff5900"}
          colorTo={files.length < 0 ? "#ff5900" : "#00FF5E"}
          borderWidth={2}
          size={250}
          duration={12}
          delay={9} // Si nécessaire, ajustez la taille du rayon
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md mb-4 justify-center items-center"
        >
          Upload images ou glisser ici
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*, video/*" // Acceptation des images et vidéos
          multiple
          className="hidden justify-center items-center"
          onChange={handleFileChange}
        />

        {/* Zone de drag and drop */}
        <div
          className={`border-dashed border-2 p-4 rounded-md text-center transition-all duration-300 ${
            isDragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isDragging
            ? "Release to upload files"
            : "or drag and drop files here"}
        </div>

        {/* Liste des fichiers uploadés */}
        {files.length > 0 && (
          <div className="mt-4 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold">Uploaded Files:</h3>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-md ml-4 mt-2"
                    onClick={() => handleRemoveFile(index)} // Suppression du fichier
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPictureAndVideo;
