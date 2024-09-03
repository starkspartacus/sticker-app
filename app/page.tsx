"use client";

import MiniatureUpload from "@/components/MinuiatureUpload";
import UploadPictureAndVideo from "@/components/uploadPictureAndVideo";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Welcome to App Sticker
        </h1>
        <div className="card p-4 border rounded-md shadow-md">
          <MiniatureUpload />
        </div>
      </div>
    </>
  );
}
