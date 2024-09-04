"use client";

// Importation des modules nécessaires
import React, { useState } from "react";
import UploadPictureAndVideo from "./uploadPictureAndVideo";
import Image from "next/image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// Définition des propriétés pour le composant MiniatureUpload
interface MiniatureUploadProps {
  files: File[];
  stickerUrl: string | null;
}

// Définition du composant MiniatureUpload
const MiniatureUpload: React.FC<MiniatureUploadProps> = ({
  files,
  stickerUrl,
}) => {
  // Déclaration des états locaux
  const [filesState, setFilesState] = useState<File[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Gestion du changement de fichiers
  const handleFilesChange = (newFiles: File[]) => {
    setFilesState(newFiles);
    generateThumbnails(newFiles);
  };

  // Génération des miniatures pour les fichiers
  const generateThumbnails = (files: File[]) => {
    const newThumbnails: string[] = [];
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        // Création d'une miniature pour les vidéos
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
        // Création d'une miniature pour les images
        newThumbnails.push(URL.createObjectURL(file));
        setThumbnails([...newThumbnails]);
      }
    });
  };

  // Gestion du clic sur une miniature
  const handleThumbnailClick = (thumbnail: string) => {
    setSelectedFile(thumbnail);
  };

  // Fermeture de la modal
  const closeModal = () => {
    setSelectedFile(null);
  };

  // Ajout d'un sticker et compression des fichiers en zip
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
      {/* Composant pour uploader des images et vidéos */}
      <UploadPictureAndVideo onFilesChange={handleFilesChange} />
      <div className="flex space-x-4 mt-4">
        {/* Affichage des miniatures */}
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

      {/* Bouton pour ajouter un sticker et zipper les fichiers */}
      <button
        onClick={addStickerAndZipFiles}
        className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Add Sticker and Zip Files"}
      </button>

      {/* Modal pour afficher le fichier sélectionné */}
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
