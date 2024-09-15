"use client";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useState, useEffect } from "react";
import ShinyButton from "./magicui/shiny-button";
import Confetti from "react-confetti";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { Buffer } from "buffer";

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
          const fileType = file.type.split("/")[0];

          if (fileType === "image") {
            // Traitement de l'image
            const imageData = e?.target?.result as string;
            if (imageData) {
              const arrayBuffer = new TextEncoder().encode(imageData).buffer;
              const blob = new Blob([arrayBuffer], { type: file.type });
              zip.file(file.name, blob);
            } else {
              reject(new Error("Failed to read image data"));
            }
          } else if (fileType === "video") {
            // Process video using FFmpeg
            const ffmpeg = new FFmpeg();
            await ffmpeg.load();
            const input = await fetchFile(file);
            await ffmpeg.writeFile(file.name, input);

            const output = `output_${file.name}`;
            const stickerX = (stickerPosition.x / 100) * 100;
            const stickerY = (stickerPosition.y / 100) * 100;
            const scaledStickerSize = (stickerSize / 100) * 100;

            await ffmpeg.exec([
              "-i",
              file.name,
              "-vf",
              `movie=${stickerUrl} [watermark]; [in][watermark] overlay=${stickerX}:${stickerY} [out]`,
              output,
            ]);

            const data = await ffmpeg.readFile("output.mp4");
            let arrayBuffer: ArrayBuffer;
            if (typeof data === "string") {
              arrayBuffer = new TextEncoder().encode(data).buffer;
            } else {
              arrayBuffer = data;
            }
            const blob = new Blob([arrayBuffer], { type: file.type });
            zip.file(file.name, blob);

            // Télécharger le zip
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipBlob);
            link.download = "output.zip";
            link.click();
            resolve();
          } else {
            reject(new Error("Unsupported file type"));
          }
        } catch (err) {
          setError("An error occurred while processing the file.");
          toast.error("An error occurred while processing the file.");
          reject(err);
        }
      };

      fileReader.readAsArrayBuffer(file);
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
          try {
            await processBatch(batch, zip, stickerImage, i);
          } catch (error) {
            console.error("Error processing batch:", error);
            setError(
              "Une erreur s'est produite lors du traitement des fichiers."
            );
            toast.error(
              "Une erreur s'est produite lors du traitement des fichiers."
            );
            setIsProcessing(false);
            return;
          }
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
        setError("Failed to load sticker image");
        toast.error("Failed to load sticker image");
        setIsProcessing(false);
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
