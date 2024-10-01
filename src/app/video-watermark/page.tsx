"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver"; // Pour télécharger les fichiers
import JSZip from "jszip"; // Pour créer le fichier ZIP
import { useRef, useState } from "react";
import Draggable from "react-draggable"; // Pour la fonction de glisser-déposer

const VideoWatermarkPage = () => {
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [sticker, setSticker] = useState<string | null>(null);
  const [showSticker, setShowSticker] = useState<boolean>(false);
  const [stickerPosition, setStickerPosition] = useState({ x: 0, y: 0 });
  const [stickerSize, setStickerSize] = useState({ width: 150, height: 150 });
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gérer l'upload de la vidéo
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const videoArray = Array.from(files).map((file) => URL.createObjectURL(file));
      setVideoPreviews(videoArray);
    }
  };

  // Gérer l'upload du sticker
  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSticker(reader.result as string);
        setShowSticker(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fonction pour appliquer un filigrane et télécharger les vidéos avec le filigrane dans un fichier ZIP
  const applyWatermarkAndDownloadZip = async () => {
    const zip = new JSZip(); // Initialiser JSZip pour stocker les vidéos
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (canvas && ctx) {
      for (let i = 0; i < videoPreviews.length; i++) {
        const video = document.createElement("video");
        video.src = videoPreviews[i];

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const stream = canvas.captureStream(); // Capturer le flux du canvas
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "video/mp4" });

          // Ajouter la vidéo avec filigrane au fichier ZIP
          zip.file(`video-${i + 1}-watermarked.mp4`, blob);
        };

        recorder.start();

        // Lire la vidéo et dessiner les frames sur le canvas avec le filigrane
        video.play();

        video.ontimeupdate = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Dessiner le filigrane (sticker)
          if (sticker) {
            const stickerImg = new Image();
            stickerImg.src = sticker;
            stickerImg.onload = () => {
              ctx.drawImage(
                stickerImg,
                stickerPosition.x,
                stickerPosition.y,
                stickerSize.width,
                stickerSize.height
              );
            };
          }
        };

        // Arrêter l'enregistrement à la fin de la vidéo
        await new Promise((resolve) => {
          video.onended = () => {
            recorder.stop();
            resolve(null);
          };
        });
      }

      // Générer le fichier ZIP et le télécharger
      zip.generateAsync({ type: "blob" }).then((blob) => {
        saveAs(blob, "watermarked-videos.zip");
      });
    }
  };

  return (
    <div className="flex h-screen">
      <MaxWidthWrapper>
        <div className="flex-grow p-10">
          <div className="flex flex-col items-center space-y-6">
            {videoPreviews.length > 0 && (
              <select
                className="border border-gray-300 rounded-md p-2 mb-4"
                value={selectedVideoIndex}
                onChange={(e) => setSelectedVideoIndex(parseInt(e.target.value, 10))}
              >
                {videoPreviews.map((video, index) => (
                  <option key={index} value={index}>
                    {`Vidéo ${index + 1}`}
                  </option>
                ))}
              </select>
            )}

            {/* Afficher la vidéo sélectionnée */}
            {videoPreviews.length > 0 && (
              <div id="video-container" className="relative w-3/4">
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-auto object-cover rounded-md border border-gray-300 shadow-lg"
                  src={videoPreviews[selectedVideoIndex]}
                />
                <canvas ref={canvasRef} className="hidden" />
                {showSticker && sticker && (
                  <Draggable
                    position={stickerPosition}
                    onStop={(e, data) => setStickerPosition({ x: data.x, y: data.y })}
                  >
                    <div
                      className="sticker"
                      style={{
                        width: stickerSize.width,
                        height: stickerSize.height,
                        position: "absolute",
                        top: 0,
                        left: 0,
                        cursor: "move",
                      }}
                    >
                      <img
                        src={sticker}
                        alt="Sticker"
                        className="w-full h-full"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </Draggable>
                )}
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Barre latérale pour options de filigrane */}
      <div className="w-1/5 bg-gray-100 flex flex-col items-center justify-start p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-6 text-center">Stickers de vidéo</h1>

        <Button className="bg-purple-500 py-2 px-4 rounded-md mb-4 w-full text-sm flex items-center justify-center">
          <label htmlFor="video-upload" className="cursor-pointer">
            Sélectionner des Vidéos
          </label>
        </Button>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={handleVideoUpload}
        />

        <Button className="bg-purple-500 py-2 px-4 rounded-md mb-4 w-full text-sm flex items-center justify-center">
          <label htmlFor="sticker-upload" className="cursor-pointer">
            Ajouter un sticker
          </label>
        </Button>
        <input
          id="sticker-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleStickerUpload}
        />

        {showSticker && (
          <div className="w-full mt-4">
            <label className="block text-sm font-medium mb-2">Taille du filigrane</label>
            <input
              type="range"
              min="50"
              max="500"
              value={stickerSize.width}
              onChange={(e) =>
                setStickerSize({
                  width: parseInt(e.target.value),
                  height: parseInt(e.target.value),
                })
              }
              className="w-full"
            />
          </div>
        )}

        <Button
          onClick={applyWatermarkAndDownloadZip}
          className="py-3 px-6 rounded-md mt-auto w-full text-sm flex items-center justify-center"
        >
          Télécharger
        </Button>
      </div>
    </div>
  );
};

export default VideoWatermarkPage;
