"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "react-modal";

interface MiniatureImageUploadProps {
  files: File[];
}

const MiniatureImageUpload: React.FC<MiniatureImageUploadProps> = ({
  files,
}) => {
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    const newThumbnails: string[] = [];
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      newThumbnails.push(url);
    });
    setThumbnails(newThumbnails);

    // Cleanup URLs on unmount
    return () => {
      newThumbnails.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const openModal = (file: string) => {
    setSelectedFile(file);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedFile(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mt-4">
        {thumbnails.map((thumbnail, index) => {
          const file = files[index];
          if (!file) return null; // Skip if file is undefined
          const isVideo = file.type.startsWith("video/");
          return (
            <div
              key={index}
              className={`relative w-24 h-24 border rounded-md overflow-hidden cursor-pointer ${
                isVideo ? "border-purple-500" : "border-orange-500"
              }`}
              onClick={() => openModal(thumbnail)}
            >
              {isVideo ? (
                <video
                  src={thumbnail}
                  className="object-cover w-full h-full"
                  onLoadedData={(e) => {
                    const video = e.currentTarget;
                    video.currentTime = 2; // Capture at 2 seconds
                  }}
                  onTimeUpdate={(e) => {
                    const video = e.currentTarget;
                    if (video.currentTime > 0) {
                      video.play();
                    }
                  }}
                />
              ) : (
                <Image
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              )}
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal} // Close modal on outside click or ESC key
        contentLabel="File Preview"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        {selectedFile && (
          <div className="relative w-full max-w-3xl h-3/4">
            {files
              .find((file) => URL.createObjectURL(file) === selectedFile)
              ?.type.startsWith("video/") ? (
              <video
                src={selectedFile}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <Image
                src={selectedFile}
                alt="Preview"
                layout="fill"
                objectFit="contain"
              />
            )}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MiniatureImageUpload;
