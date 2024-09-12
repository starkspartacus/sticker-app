"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
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
                  (stickerPosition.x / 100) * canvas.width - stickerSize / 2,
                  (stickerPosition.y / 100) * canvas.height - stickerSize / 2,
                  stickerSize,
                  stickerSize
                );
                setPreviewUrl(canvas.toDataURL());
              };
            } else {
              setPreviewUrl(canvas.toDataURL());
            }
          }
        };
      };
      fileReader.readAsDataURL(file);
    };

    handlePreview();
  }, [file, stickerUrl, stickerPosition, stickerSize]);

  return (
    <div>
      {previewUrl && (
        <div className="mt-4">
          <Image src={previewUrl} alt="Preview" width={300} height={300} />
        </div>
      )}
    </div>
  );
};

export default PreviewStickerOnFile;
