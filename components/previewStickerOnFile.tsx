"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PreviewStickerOnFileProps {
  file: File;
  stickerUrl: string | null;
  stickerPosition: { x: number; y: number };
  stickerSize: number;
}

const PreviewStickerOnFile: React.FC<PreviewStickerOnFileProps> = ({
  file,
  stickerUrl,
  stickerPosition,
  stickerSize,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePreview = () => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (ctx) {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          if (stickerUrl) {
            const stickerImg = new window.Image();
            stickerImg.src = stickerUrl;
            stickerImg.onload = () => {
              ctx.drawImage(
                stickerImg,
                (stickerPosition.x / 100) * canvas.width,
                (stickerPosition.y / 100) * canvas.height,
                stickerSize,
                stickerSize
              );
              setPreviewUrl(canvas.toDataURL());
            };
          }
        }
      };
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div>
      <button
        onClick={handlePreview}
        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
      >
        Voir l&apos;image avec le sticker
      </button>
      {previewUrl && (
        <div className="mt-4">
          {/* <h2 className="text-xl font-semibold">Preview</h2> */}
          <Image src={previewUrl} alt="Preview" width={300} height={300} />
        </div>
      )}
    </div>
  );
};

export default PreviewStickerOnFile;
