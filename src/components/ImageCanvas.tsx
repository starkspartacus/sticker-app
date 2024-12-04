"use client";

import { Move } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ImageCanvasProps {
  image: string;
  sticker: string | null;
  scale: number;
  stickerSize: number;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onCanvasSize: (size: { width: number; height: number }) => void;
}

export default function ImageCanvas({
  image,
  sticker,
  scale,
  stickerSize,
  position,
  onPositionChange,
  onCanvasSize,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastPositionRef = useRef(position);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const img = new Image();
    img.src = image;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (sticker) {
      const stickerImg = new Image();
      stickerImg.src = sticker;
      const stickerBaseSize = Math.min(canvas.width, canvas.height) * stickerSize * scale;
      ctx.drawImage(stickerImg, position.x, position.y, stickerBaseSize, stickerBaseSize);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.src = image;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      onCanvasSize({ width: img.width, height: img.height });
      draw();
    };

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [image, sticker, position, scale, stickerSize, onCanvasSize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sticker) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - rect.left - position.x,
        y: e.clientY - rect.top - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !sticker) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newPosition = {
        x: e.clientX - rect.left - dragStart.x,
        y: e.clientY - rect.top - dragStart.y,
      };

      // Interpolation fluide
      const lerpFactor = 0.5;
      const smoothPosition = {
        x: lastPositionRef.current.x + (newPosition.x - lastPositionRef.current.x) * lerpFactor,
        y: lastPositionRef.current.y + (newPosition.y - lastPositionRef.current.y) * lerpFactor,
      };

      lastPositionRef.current = smoothPosition;
      onPositionChange(smoothPosition);

      animationFrameRef.current = requestAnimationFrame(draw);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain image-canvas cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      {sticker && (
        <div
          className={`absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center transition-opacity duration-200 ${
            isDragging ? "opacity-0" : "opacity-100"
          }`}
        >
          <Move className="w-4 h-4 mr-2" />
          Déplacez le sticker
        </div>
      )}
    </div>
  );
}
