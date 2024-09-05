"use client";

import React, { useState } from "react";

interface StickerSizeAdjusterProps {
  onSizeChange: (size: { width: number; height: number }) => void;
}

const StickerSizeAdjuster: React.FC<StickerSizeAdjusterProps> = ({
  onSizeChange,
}) => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 100,
    height: 100,
  });

  const handleSizeChange = (axis: "width" | "height", value: number) => {
    const newSize = { ...size, [axis]: value };
    setSize(newSize);
    onSizeChange(newSize);
  };

  return (
    <div className="flex flex-col items-center p-4 border rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-4">Adjust Sticker Size</h3>

      {/* Slider for width */}
      <label className="mb-2 font-semibold text-gray-700">Width</label>
      <input
        type="range"
        min="50"
        max="300"
        value={size.width}
        onChange={(e) => handleSizeChange("width", parseInt(e.target.value))}
        className="w-full"
      />
      <span>{size.width}px</span>

      {/* Slider for height */}
      <label className="mt-4 mb-2 font-semibold text-gray-700">Height</label>
      <input
        type="range"
        min="50"
        max="300"
        value={size.height}
        onChange={(e) => handleSizeChange("height", parseInt(e.target.value))}
        className="w-full"
      />
      <span>{size.height}px</span>
    </div>
  );
};

export default StickerSizeAdjuster;
