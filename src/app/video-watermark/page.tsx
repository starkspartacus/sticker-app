"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver"; // Import file-saver to download files
import JSZip from "jszip"; // Import JSZip for creating the zip file
import { Video } from "lucide-react"; // Icon for video upload
import { useEffect, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable"; // Import react-draggable for drag functionality

const VideoWatermarkPage = () => {
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [sticker, setSticker] = useState<string | null>(null);
  const [showSticker, setShowSticker] = useState<boolean>(false);
  const [stickerPosition, setStickerPosition] = useState({ x: 0, y: 0 }); // Global sticker position
  const [stickerSize, setStickerSize] = useState({ width: 150, height: 150 }); // Global sticker size
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0); // For tracking selected video

  useEffect(() => {
    const storedVideos = localStorage.getItem("selectedVideos");
    if (storedVideos) {
      setVideoPreviews(JSON.parse(storedVideos));
    }
  }, []);

  // Handle sticker upload
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

  // Handle drag stop event, update global sticker position
  const handleDragStop: DraggableEventHandler = (e, data) => {
    setStickerPosition({ x: data.x, y: data.y });
  };

  // Handle video selection from dropdown
  const handleVideoSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    setSelectedVideoIndex(index);
  };

  // Function to handle the size adjustment
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setStickerSize({ width: newSize, height: newSize });
  };

  // Function to download the videos with the watermark in a zip file
  const downloadVideosAsZip = async () => {
    const zip = new JSZip();

    for (let i = 0; i < videoPreviews.length; i++) {
      const videoElement = document.createElement("video");
      videoElement.src = videoPreviews[i];

      // Wait for the video to load metadata (dimensions)
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          canvas.width = videoElement.videoWidth;
          canvas.height = videoElement.videoHeight;

          // Draw the video frame
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

          // Draw the sticker (watermark)
          if (sticker) {
            const stickerImg = new window.Image();
            stickerImg.src = sticker;

            stickerImg.onload = () => {
              const container = document.querySelector("#video-container");
              if (container) {
                const scaledX = (stickerPosition.x / container.clientWidth) * canvas.width;
                const scaledY = (stickerPosition.y / container.clientHeight) * canvas.height;
                const scaledWidth = (stickerSize.width / container.clientWidth) * canvas.width;
                const scaledHeight = (stickerSize.height / container.clientHeight) * canvas.height;

                ctx.drawImage(stickerImg, scaledX, scaledY, scaledWidth, scaledHeight);
              }
            };
          }
          resolve(true);
        };
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        // Reference the canvas created above
        const canvas = document.querySelector("canvas");
        if (canvas instanceof HTMLCanvasElement) {
          canvas.toBlob((blob) => resolve(blob), "image/jpeg");
        } else {
          resolve(null);
        }
      });

      if (blob) {
        zip.file(`video-frame-${i + 1}.jpg`, blob); // Save video frames as images
      }
    }

    // Generate the zip and download it
    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, "watermarked-videos.zip");
    });
  };

  return (
    <div className="flex h-screen">
      <MaxWidthWrapper>
        <div className="flex-grow p-10">
          <div className="flex flex-col items-center space-y-6">
            {/* Dropdown to select different videos */}
            {videoPreviews.length > 0 && (
              <select
                className="border border-gray-300 rounded-md p-2 mb-4"
                value={selectedVideoIndex}
                onChange={handleVideoSelection}
              >
                {videoPreviews.map((video, index) => (
                  <option key={index} value={index}>
                    {`Vidéo ${index + 1}`}
                  </option>
                ))}
              </select>
            )}

            {/* Display the currently selected video */}
            {videoPreviews.length > 0 && (
              <div id="video-container" className="relative w-3/4">
                <video
                  src={videoPreviews[selectedVideoIndex]}
                  controls
                  className="w-full h-auto object-cover rounded-md border border-gray-300 shadow-lg"
                />
                {showSticker && sticker && (
                  <Draggable
                    position={stickerPosition} // Global position across all videos
                    onStop={handleDragStop} // Handle drag stop to set new position
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

            {videoPreviews.length > 1 && (
              <div className="flex justify-center space-x-6">
                {videoPreviews.slice(1).map((src, index) => (
                  <div key={index} className="relative text-center">
                    <video
                      src={src}
                      controls
                      className="w-40 h-auto object-cover rounded-md border border-gray-300"
                    />
                    <p className="mt-2 text-sm text-gray-600">{`Vidéo ${index + 2}`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>

      {/* Sidebar for watermark options */}
      <div className="w-1/5 bg-gray-100 flex flex-col items-center justify-start p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-6 text-center">Stickers de vidéo</h1>

        <Button className="bg-purple-500 py-2 px-4 rounded-md mb-4 w-full text-sm flex items-center justify-center">
          <Video className="w-4 h-4 mr-2" />
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

        {/* Slider to adjust the size of the sticker */}
        {showSticker && (
          <div className="w-full mt-4">
            <label className="block text-sm font-medium mb-2">Taille du filigrane</label>
            <input
              type="range"
              min="50"
              max="500"
              value={stickerSize.width} // Assume the height follows the width for simplicity
              onChange={handleSizeChange}
              className="w-full"
            />
          </div>
        )}

        <Button
          onClick={downloadVideosAsZip}
          className="py-3 px-6 rounded-md mt-auto w-full text-sm flex items-center justify-center"
        >
          Télécharger
        </Button>
      </div>
    </div>
  );
};

export default VideoWatermarkPage;
