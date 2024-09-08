"use client";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useState, useEffect } from "react";
import ShinyButton from "./magicui/shiny-button";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ButtonAddStickerOnFilesProps {
  files: File[];
  stickerUrl: string | null;
  stickerPosition: { x: number; y: number };
  stickerSize: number;
}

const ButtonAddStickerOnFiles: React.FC<ButtonAddStickerOnFilesProps> = ({
  files,
  stickerUrl,
  stickerPosition,
  stickerSize,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const processFile = async (
    file: File,
    stickerImage: HTMLImageElement,
    index: number,
    zip: JSZip
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const imageBuffer = e.target?.result as string;
          const img = new Image();
          img.src = imageBuffer;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;

              // Draw the original image
              ctx.drawImage(img, 0, 0);

              // Draw the sticker
              const stickerX = (stickerPosition.x / 100) * img.width;
              const stickerY = (stickerPosition.y / 100) * img.height;
              ctx.drawImage(
                stickerImage,
                stickerX,
                stickerY,
                stickerSize,
                stickerSize
              );

              canvas.toBlob((blob) => {
                if (blob) {
                  zip.file(file.name, blob);
                  resolve();
                } else {
                  reject(new Error("Failed to process image"));
                }
              });
            } else {
              reject(new Error("Failed to get canvas context"));
            }
          };

          img.onerror = () => {
            reject(new Error("Failed to load image"));
          };
        } catch (err) {
          reject(err);
        }
      };

      fileReader.readAsDataURL(file);
    });
  };

  const processBatch = async (
    batch: File[],
    zip: JSZip,
    stickerImage: HTMLImageElement,
    startIndex: number
  ): Promise<void> => {
    await Promise.all(
      batch.map((file, index) =>
        processFile(file, stickerImage, startIndex + index, zip).then(() => {
          setProgress(((startIndex + index + 1) / files.length) * 100);
        })
      )
    );
  };

  const addStickerAndZipFiles = async (): Promise<void> => {
    if (!stickerUrl || files.length === 0) return;

    setIsProcessing(true);
    try {
      const stickerImage = new Image();
      stickerImage.src = stickerUrl;

      stickerImage.onload = async () => {
        const zip = new JSZip();
        const batchSize = 1; // Process 1 file at a time to reduce memory usage
        for (let i = 0; i < files.length; i += batchSize) {
          const batch = files.slice(i, i + batchSize);
          await processBatch(batch, zip, stickerImage, i);
        }

        // Quand tous les fichiers sont prêts, générer le zip
        zip.generateAsync({ type: "blob" }).then((content: Blob) => {
          saveAs(content, "files_with_stickers.zip");
          setIsProcessing(false);
          setShowConfetti(true);
          toast.success("Téléchargement terminé !");
          setTimeout(() => {
            setShowConfetti(false);
            window.location.reload(); // Reset the page
          }, 5000); // Afficher les confettis pendant 5 secondes
        });
      };

      stickerImage.onerror = () => {
        throw new Error("Failed to load sticker image");
      };
    } catch (error) {
      console.error("Error processing files:", error);
      setIsProcessing(false);
      setError("Une erreur s'est produite lors du traitement des fichiers.");
      toast.error("Une erreur s'est produite lors du traitement des fichiers.");
    }
  };

  return (
    <div>
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-green-600 h-4 rounded-full"
              style={{ width: `${progress}%`, transition: "width 0.5s" }}
            ></div>
          </div>
          <p>{progress.toFixed(2)}%</p>
        </div>
      ) : (
        <ShinyButton
          text="Télécharger vos images et vidéos"
          onClick={addStickerAndZipFiles}
          className="bg-green-600 text-white p-3 py-2 px-4 rounded-md mt-4 justify-center items-center"
          disabled={isProcessing}
        />
      )}
      {error && (
        <button
          onClick={addStickerAndZipFiles}
          className="bg-red-500 text-white p-3 py-2 px-4 rounded-md mt-4 justify-center items-center"
        >
          Réessayer le traitement
        </button>
      )}
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}
      <ToastContainer />
    </div>
  );
};

export default ButtonAddStickerOnFiles;
