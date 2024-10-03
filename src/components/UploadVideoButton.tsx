"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const UploadVideoButton = () => {
  const [videos, setVideos] = useState<FileList | null>(null);
  const router = useRouter();
  console.log(videos);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedVideos = e.target.files;
    if (selectedVideos) {
      const videoArray = Array.from(selectedVideos).map((video) => URL.createObjectURL(video));
      localStorage.setItem("selectedVideos", JSON.stringify(videoArray)); // Save video URLs to localStorage
      setVideos(selectedVideos);
      router.push("/video-watermark");
    }
  };

  return (
    <div>
      <Button>
        <label htmlFor="video-upload" className="cursor-pointer">
          Sélectionner des Vidéos
        </label>
      </Button>
      <input
        id="video-upload"
        type="file"
        multiple
        className="hidden"
        onChange={handleVideoChange}
      />
    </div>
  );
};

export default UploadVideoButton;
