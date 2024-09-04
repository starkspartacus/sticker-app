"use client";

import React, { useState, useEffect } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import uploadPictureAndVideo from "./uploadPictureAndVideo";
import MinuiatureUpload from "./MinuiatureUpload";

// Interface for the component props
interface ButtonAddStickerOnFilesProps {
  stickerUrl: string | null;
  files: File[];
}

const ButtonAddStickerOnFiles: React.FC<ButtonAddStickerOnFilesProps> = ({
  stickerUrl,
  files,
}) => {
  useEffect(() => {
    console.log("stickerUrl:", stickerUrl);
    console.log("files:", files);
  }, [stickerUrl, files]);

  const [isProcessing, setIsProcessing] = useState(false);

  // Function to add sticker to all files and zip them
  const addStickerAndZipFiles = async () => {
    if (!stickerUrl || files.length === 0) return;

    setIsProcessing(true);

    // Create a new JSZip instance
    const zip = new JSZip();
    // Fetch the sticker image as a Blob
    const stickerImage = await fetch(stickerUrl).then((res) => res.blob());

    // Iterate over each file
    files.forEach((file, index) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            // Set canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;
            // Draw the original image on the canvas
            ctx.drawImage(img, 0, 0);
            // Draw the sticker image on top of the original image
            const stickerImg = new Image();
            stickerImg.src = URL.createObjectURL(stickerImage);
            stickerImg.onload = () => {
              ctx.drawImage(stickerImg, 0, 0, 100, 100); // Adjust sticker size and position as needed

              // Convert the canvas to a Blob and add it to the zip file
              canvas.toBlob((blob) => {
                if (blob) {
                  zip.file(`file_with_sticker_${index + 1}.png`, blob);
                  // If this is the last file, generate the zip and trigger download
                  if (index === files.length - 1) {
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
    <button
      onClick={addStickerAndZipFiles}
      className="bg-green-500 text-white py-2 px-4 rounded-md"
      disabled={isProcessing}
    >
      {isProcessing ? "Processing..." : "Add Sticker and Zip Files"}
    </button>
  );
};

export default ButtonAddStickerOnFiles;
