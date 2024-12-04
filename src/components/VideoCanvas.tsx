"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Move, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoCanvasProps {
  video: string;
  sticker: string | null;
  scale: number;
  stickerSize: number;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  onCanvasSize: (size: { width: number; height: number }) => void;
}

export default function VideoCanvas({
  video,
  sticker,
  scale,
  stickerSize,
  position,
  onPositionChange,
  onCanvasSize,
}: VideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationFrameRef = useRef<number>();
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const lastPositionRef = useRef(position);

  const draw = () => {
    const canvas = canvasRef.current;
    const videoElement = videoRef.current;
    if (!canvas || !videoElement) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Définir les dimensions du canvas pour correspondre à la vidéo
    if (canvas.width !== videoElement.videoWidth || canvas.height !== videoElement.videoHeight) {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      onCanvasSize({ width: canvas.width, height: canvas.height });
    }

    // Dessiner la vidéo
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    // Dessiner le sticker si présent
    if (sticker) {
      const stickerImg = new Image();
      stickerImg.src = sticker;
      const stickerBaseSize = Math.min(canvas.width, canvas.height) * stickerSize * scale;
      ctx.drawImage(stickerImg, position.x, position.y, stickerBaseSize, stickerBaseSize);
    }

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(draw);
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      draw();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      draw();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    videoElement.addEventListener("timeupdate", handleTimeUpdate);
    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("pause", handlePause);

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.removeEventListener("timeupdate", handleTimeUpdate);
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("pause", handlePause);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [video]);

  useEffect(() => {
    draw();
  }, [sticker, position, scale, stickerSize]);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const handleTimeChange = (newTime: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime[0];
      draw();
    }
  };

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

      const lerpFactor = 0.5;
      const smoothPosition = {
        x: lastPositionRef.current.x + (newPosition.x - lastPositionRef.current.x) * lerpFactor,
        y: lastPositionRef.current.y + (newPosition.y - lastPositionRef.current.y) * lerpFactor,
      };

      lastPositionRef.current = smoothPosition;
      onPositionChange(smoothPosition);
      draw();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full space-y-4">
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={video}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
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

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="text-sm text-muted-foreground w-20">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <Slider
          value={[currentTime]}
          max={duration}
          step={0.1}
          onValueChange={handleTimeChange}
          className="w-full"
        />
      </div>
    </div>
  );
}
