"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const UploadVideoButton = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const router = useRouter();
  console.log(files);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
      localStorage.setItem("selectedVideos", JSON.stringify(fileArray)); // Enregistre les URLs des vidéos dans localStorage
      setFiles(selectedFiles);
      router.push("/video-watermark"); // Redirige vers la page dédiée aux vidéos avec watermark
    }
  };

  return (
    <>
      <Button>
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
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadVideoButton;
