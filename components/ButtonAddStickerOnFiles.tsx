"use client";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useState } from "react";

// Props pour recevoir les fichiers et le sticker à appliquer
interface ButtonAddStickerOnFilesProps {
  files: File[];
  stickerUrl: string | null;
  stickerPosition: { x: number; y: number };
}

const ButtonAddStickerOnFiles: React.FC<ButtonAddStickerOnFilesProps> = ({
  files,
  stickerUrl,
  stickerPosition,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const addStickerAndZipFiles = async () => {
    if (!stickerUrl || files.length === 0) return;

    setIsProcessing(true);
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
              // Appliquer le sticker à la position sélectionnée
              ctx.drawImage(
                stickerImg,
                (stickerPosition.x / 100) * canvas.width,
                (stickerPosition.y / 100) * canvas.height,
                100, // Taille du sticker (fixe, ajustable)
                100
              );

              // Convertir le canvas modifié en blob
              canvas.toBlob((blob) => {
                if (blob) {
                  zip.file(`file_with_sticker_${index + 1}.png`, blob);
                  if (index === files.length - 1) {
                    // Quand tous les fichiers sont prêts, générer le zip
                    zip.generateAsync({ type: "blob" }).then((content: Blob) => {
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
    }
  };

  return (
    <div>
      <button
        onClick={addStickerAndZipFiles}
        className="bg-green-500 text-white py-2 px-4 rounded-md mt-4"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Add Sticker and Zip Files"}
      </button>
    </div>
  );
};

export default ButtonAddStickerOnFiles;
