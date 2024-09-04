"use client";

import React, { useState, useEffect } from "react";
import UploadPictureAndVideo from "./uploadPictureAndVideo";
import Image from "next/image";

interface MinuiatureUploadProps {
  files: File[];
}

const MiniatureUpload: React.FC<MinuiatureUploadProps> = ({ files }) => {
  // State pour stocker les fichiers téléchargés
  const [filesState, setFilesState] = useState<File[]>([]);
  // State pour stocker les miniatures générées
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  // State pour stocker le fichier sélectionné pour l'aperçu
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Fonction pour gérer le changement de fichiers
  const handleFilesChange = (newFiles: File[]) => {
    setFilesState(newFiles);
    generateThumbnails(newFiles);
  };

  // Fonction pour générer des miniatures pour les fichiers téléchargés
  const generateThumbnails = (files: File[]) => {
    const newThumbnails: string[] = [];
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        // Si le fichier est une vidéo, créer une miniature à partir de la vidéo
        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.currentTime = 1; // Capturer la miniature à 1 seconde

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
        // Si le fichier est une image, utiliser l'URL de l'objet pour la miniature
        newThumbnails.push(URL.createObjectURL(file));
        setThumbnails([...newThumbnails]);
      }
    });
  };

  // Fonction pour gérer le clic sur une miniature
  const handleThumbnailClick = (thumbnail: string) => {
    setSelectedFile(thumbnail);
  };

  // Fonction pour fermer le modal d'aperçu
  const closeModal = () => {
    setSelectedFile(null);
  };

  return (
    <div>
      {/* Composant pour télécharger des images et des vidéos */}
      <UploadPictureAndVideo onFilesChange={handleFilesChange} />
      <div className="flex space-x-4 mt-4">
        {/* Afficher les miniatures générées */}
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

      {/* Modal pour afficher l'aperçu du fichier sélectionné */}
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
