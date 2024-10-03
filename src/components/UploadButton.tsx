"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const UploadButton = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const router = useRouter();
  console.log(files);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles).map((file) => URL.createObjectURL(file));
      localStorage.setItem("selectedImages", JSON.stringify(fileArray)); // Save file URLs to localStorage
      setFiles(selectedFiles);
      router.push("/watermark");
    }
  };

  return (
    <div>
      <Button>
        <label htmlFor="file-upload" className="cursor-pointer">
          Sélectionner des Images
        </label>
      </Button>
      <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default UploadButton;
