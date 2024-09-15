"use client";

import React, { useState, useRef, useEffect } from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { FiUploadCloud } from "react-icons/fi";
import { LuFileSymlink } from "react-icons/lu";
import { MdClose, MdDone } from "react-icons/md";
import { ImSpinner3 } from "react-icons/im";
import { BiError } from "react-icons/bi";
import ReactDropzone, { FileRejection, DropEvent } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";

interface UploadPictureAndVideoProps {
  onFilesChange: (files: File[]) => void;
  onStickerChange: (file: File | null, size: number) => void;
}

const UploadPictureAndVideo: React.FC<UploadPictureAndVideoProps> = ({
  onFilesChange,
  onStickerChange,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = (
    acceptedFiles: File[],
    fileRejections: FileRejection[],
    event: DropEvent
  ) => {
    if (fileRejections.length > 0) {
      toast({
        variant: "destructive",
        title: "Error uploading your file(s)",
        description: "Allowed Files: Images and Videos.",
        duration: 5000,
      });
    }
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-lg p-6 border rounded-md shadow-md">
        <BorderBeam
          colorFrom={files.length > 0 ? "#00FF5E" : "#ff5900"}
          colorTo={files.length < 0 ? "#ff5900" : "#00FF5E"}
          borderWidth={2}
          size={250}
          duration={12}
          delay={9}
        />

        <ReactDropzone
          onDrop={handleDrop}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
          accept={{ "image/*": [], "video/*": [] }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className={`border-dashed border-2 p-4 rounded-md text-center transition-all duration-300 ${
                isDragging ? "border-blue-500 bg-blue-100" : "border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              {isDragging ? (
                <div className="flex flex-col items-center">
                  <LuFileSymlink className="text-6xl" />
                  <p>Release to upload files</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <FiUploadCloud className="text-6xl" />
                  <p>Click or drag and drop files here</p>
                </div>
              )}
            </div>
          )}
        </ReactDropzone>

        {files.length > 0 && (
          <div className="mt-4 max-h-64 overflow-y-auto">
            <h3 className="text-lg font-semibold">Uploaded Files:</h3>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded-md ml-4 mt-2"
                    onClick={() => handleRemoveFile(index)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPictureAndVideo;
