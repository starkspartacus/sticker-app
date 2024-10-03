"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Image } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Draggable, { DraggableEventHandler } from "react-draggable"; // Import react-draggable for drag functionality

const WatermarkPage = () => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sticker, setSticker] = useState<string | null>(null);
  const [showSticker, setShowSticker] = useState<boolean>(false);
  const [stickerPosition, setStickerPosition] = useState({ x: 0, y: 0 }); // Global sticker position
  const [stickerSize, setStickerSize] = useState({ width: 150, height: 150 }); // Global sticker size
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0); // For tracking selected image
  const stickerRef = useRef(null); // Use ref to avoid findDOMNode warning

  useEffect(() => {
    const storedImages = localStorage.getItem("selectedImages");
    if (storedImages) {
      setImagePreviews(JSON.parse(storedImages));
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

  // Handle image selection from dropdown
  const handleImageSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value, 10);
    setSelectedImageIndex(index);
  };

  // Function to handle the size adjustment
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setStickerSize({ width: newSize, height: newSize });
  };

  // Function to convert image URL to base64 data URL
  const imageToDataURL = (url: string, callback: (dataurl: string) => void) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  };

  // Upload image and sticker to the backend and apply the watermark
  const uploadImageWithWatermark = async (imageFile: File, stickerFile: File): Promise<void> => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("watermark", stickerFile);

    try {
      const response = await axios.post("http://localhost:8000/watermark-image/", formData, {
        responseType: "blob", // Important pour recevoir le fichier image modifié
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Télécharger l'image modifiée
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "watermarked_image.jpg");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Convert data URL to File
  const dataURLToFile = (dataurl: string, filename: string): File => {
    try {
      console.log("Data URL:", dataurl); // Ajout du log pour voir la valeur de `dataurl`
      if (!dataurl.startsWith("data:image/")) {
        throw new Error("Invalid data URL format");
      }
      const arr = dataurl.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    } catch (error) {
      console.error("Error in dataURLToFile:", error);
      throw error;
    }
  };

  // Function to handle the image download with watermark
  const handleDownloadWithWatermark = () => {
    if (imagePreviews[selectedImageIndex] && sticker) {
      // Convert the selected image and sticker to base64 URLs first
      imageToDataURL(imagePreviews[selectedImageIndex], (imageDataUrl) => {
        imageToDataURL(sticker!, (stickerDataUrl) => {
          const imageFile = dataURLToFile(imageDataUrl, "image.jpg");
          const stickerFile = dataURLToFile(stickerDataUrl, "sticker.png");
          uploadImageWithWatermark(imageFile, stickerFile);
        });
      });
    } else {
      console.error("Image or sticker is missing");
    }
  };

  return (
    <div className="flex h-screen">
      <MaxWidthWrapper>
        <div className="flex-grow p-10">
          <div className="flex flex-col items-center space-y-6">
            {imagePreviews.length > 0 && (
              <select
                className="border border-gray-300 rounded-md p-2 mb-4"
                value={selectedImageIndex}
                onChange={handleImageSelection}
              >
                {imagePreviews.map((image, index) => (
                  <option key={index} value={index}>
                    {`Image ${index + 1}`}
                  </option>
                ))}
              </select>
            )}

            {imagePreviews.length > 0 && (
              <div id="image-container" className="relative w-3/4">
                <img
                  src={imagePreviews[selectedImageIndex]}
                  alt="Main Image"
                  className="w-full h-auto object-cover rounded-md border border-gray-300 shadow-lg"
                />
                {showSticker && sticker && (
                  <Draggable
                    nodeRef={stickerRef} // Use ref to avoid findDOMNode warning
                    position={stickerPosition}
                    onStop={handleDragStop}
                  >
                    <div
                      ref={stickerRef}
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

            {imagePreviews.length > 1 && (
              <div className="flex justify-center space-x-6">
                {imagePreviews.slice(1).map((src, index) => (
                  <div key={index} className="relative text-center">
                    <img
                      src={src}
                      alt={`Image ${index + 2}`}
                      className="w-40 h-auto object-cover rounded-md border border-gray-300"
                    />
                    <p className="mt-2 text-sm text-gray-600">{`Image ${index + 2}`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </MaxWidthWrapper>

      <div className="w-1/5 bg-gray-100 flex flex-col items-center justify-start p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-6 text-center">Stickers d&apos;image</h1>

        <Button className="bg-purple-500 py-2 px-4 rounded-md mb-4 w-full text-sm flex items-center justify-center">
          <Image className="w-4 h-4 mr-2" />
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
              onChange={handleSizeChange}
              className="w-full"
            />
          </div>
        )}

        <Button
          onClick={handleDownloadWithWatermark}
          className="py-3 px-6 rounded-md mt-auto w-full text-sm flex items-center justify-center"
        >
          Télécharger
        </Button>
      </div>
    </div>
  );
};

export default WatermarkPage;
