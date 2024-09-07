"use client";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useState } from "react";
import ShinyButton from "./magicui/shiny-button";

// Props pour recevoir les fichiers, le sticker à appliquer, la position et la taille
interface ButtonAddStickerOnFilesProps {
  files: File[];
  stickerUrl: string | null;
  stickerPosition: { x: number; y: number };
  stickerSize: number; // Nouvelle propriété pour la taille du sticker
  videoFile: File | null;
  stickerImage: File | null;
  position: { x: number; y: number };
}

const ButtonAddStickerOnFiles: React.FC<ButtonAddStickerOnFilesProps> = ({
  files,
  stickerUrl,
  stickerPosition,
  stickerSize, // Taille dynamique du sticker
  videoFile,
  stickerImage,
  position,
}) => {
  const [processing, setProcessing] = useState(false);

  const handleAddSticker = () => {
    setProcessing(true);

    const worker = new Worker(
      new URL("../public/stickerWorker.js", import.meta.url)
    );

    worker.onmessage = (event) => {
      if (event.data.success) {
        const processedVideoBlob = event.data.processedVideoBlob;

        // Téléchargement de la vidéo traitée
        const url = URL.createObjectURL(processedVideoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "processed_video.webm";
        a.click();
        URL.revokeObjectURL(url);

        setProcessing(false);
      }
    };

    worker.postMessage({ videoFile, stickerImage, position });
  };

  const addStickerAndZipFiles = async () => {
    if (!stickerUrl || files.length === 0) return;

    /* setIsProcessing(true); */
    const zip = new JSZip();
    const stickerImage = await fetch(stickerUrl).then((res) => res.blob());

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const img = new window.Image(); // Utilisation de l'objet global Image
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            // Taille du canvas selon l'image
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0); // Dessiner l'image d'origine

            const stickerImg = new window.Image(); // Utilisation de l'objet global Image
            stickerImg.src = URL.createObjectURL(stickerImage);

            stickerImg.onload = () => {
              // Appliquer le sticker à la position sélectionnée avec la taille dynamique
              ctx.drawImage(
                stickerImg,
                (stickerPosition.x / 100) * canvas.width, // Position X en pourcentage
                (stickerPosition.y / 100) * canvas.height, // Position Y en pourcentage
                stickerSize, // Utilisation de la taille du sticker dynamique
                stickerSize // Largeur et hauteur égales pour garder le sticker carré
              );

              // Convertir le canvas modifié en blob
              canvas.toBlob((blob) => {
                if (blob) {
                  zip.file(`file_with_sticker_${index + 1}.png`, blob);
                  if (index === files.length - 1) {
                    // Quand tous les fichiers sont prêts, générer le zip
                    zip
                      .generateAsync({ type: "blob" })
                      .then((content: Blob) => {
                        saveAs(content, "files_with_stickers.zip");
                        setProcessing(false); // Corrected from setIsProcessing to setProcessing
                      });
                  }
                }
              });
            };
          }
        };
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {processing ? ( // Changed from isProcessing to processing
        "Traitement..."
      ) : (
        <ShinyButton
          text="Télécharger vos images et vidéos"
          onClick={addStickerAndZipFiles}
          className="bg-green-500 text-white py-2 px-4 rounded-md mt-4 justify-center items-center"
          disabled={processing}
        />
      )}
    </div>
  );
};

export default ButtonAddStickerOnFiles;
