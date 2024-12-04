"use client";

import StickerSelector from "@/components/StickerSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ProgressDialog from "@/components/ui/progress-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import VideoCanvas from "@/components/VideoCanvas";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { cn } from "@/lib/utils";
import { fetchFile } from "@ffmpeg/util";
import JSZip from "jszip";
import { Download, Minus, Plus, Trash2, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface VideoItem {
  id: string;
  data: string;
  name: string;
}

interface StickerPosition {
  x: number;
  y: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [stickerPosition, setStickerPosition] = useState<StickerPosition>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const [stickerSize, setStickerSize] = useState(0.3);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState("");
  const { ffmpeg, loaded, error } = useFFmpeg();

  const selectedVideo = videos.find((video) => video.id === selectedVideoId);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith("video/")) {
        toast.error(`${file.name} n'est pas une vidéo`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setVideos((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            data: result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (files.length > 0) {
      toast.success(`${files.length} vidéo(s) téléchargée(s)`);
      if (!selectedVideoId) {
        setTimeout(() => {
          const firstVideo = files[0];
          const reader = new FileReader();
          reader.onload = () => {
            setSelectedVideoId(Math.random().toString(36).substring(7));
          };
          reader.readAsDataURL(firstVideo);
        }, 100);
      }
    }
  };

  const handleDownload = async () => {
    if (!videos.length || !loaded || !selectedSticker) {
      toast.error("Veuillez sélectionner une vidéo et un sticker");
      return;
    }

    if (error) {
      toast.error(`Erreur FFmpeg: ${error}`);
      return;
    }

    setIsDownloading(true);
    setProgress(0);

    try {
      const zip = new JSZip();
      const totalVideos = videos.length;

      const ffmpegConfig = [
        "-preset",
        "ultrafast",
        "-crf",
        "28",
        "-movflags",
        "+faststart",
        "-threads",
        "4",
      ];

      const xRatio = stickerPosition.x / canvasSize.width;
      const yRatio = stickerPosition.y / canvasSize.height;

      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        setCurrentFile(`Traitement de ${video.name} (${i + 1}/${totalVideos})`);

        try {
          const videoBlob = await fetch(video.data).then((r) => r.blob());
          const inputFileName = `input_${i}.mp4`;
          const outputFileName = `output_${i}.mp4`;

          await ffmpeg.writeFile(inputFileName, await fetchFile(videoBlob));

          const stickerBlob = await fetch(selectedSticker).then((r) => r.blob());
          const stickerFileName = `sticker_${i}.png`;
          await ffmpeg.writeFile(stickerFileName, await fetchFile(stickerBlob));

          const videoElement = document.createElement("video");
          await new Promise((resolve, reject) => {
            videoElement.onloadedmetadata = resolve;
            videoElement.onerror = reject;
            videoElement.src = URL.createObjectURL(videoBlob);
          });

          const videoWidth = videoElement.videoWidth;
          const videoHeight = videoElement.videoHeight;
          URL.revokeObjectURL(videoElement.src);

          const stickerBaseSize = Math.min(videoWidth, videoHeight) * stickerSize;
          const xPos = Math.round(videoWidth * xRatio);
          const yPos = Math.round(videoHeight * yRatio);

          await ffmpeg.exec([
            "-i",
            inputFileName,
            "-i",
            stickerFileName,
            "-filter_complex",
            `[1:v]scale=${stickerBaseSize}:${stickerBaseSize}[sticker];[0:v][sticker]overlay=${xPos}:${yPos}`,
            "-c:a",
            "copy",
            ...ffmpegConfig,
            outputFileName,
          ]);

          const outputData = await ffmpeg.readFile(outputFileName);
          let uint8Array;

          if (outputData instanceof Uint8Array) {
            uint8Array = outputData;
          } else if (typeof outputData === "string") {
            const binaryString = atob(outputData);
            uint8Array = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              uint8Array[i] = binaryString.charCodeAt(i);
            }
          } else {
            throw new Error("Format de données non pris en charge");
          }

          const outputBlob = new Blob([uint8Array], { type: "video/mp4" });
          const videoName = video.name.replace(/\.[^/.]+$/, "") + "_with_sticker.mp4";
          zip.file(videoName, outputBlob);

          await ffmpeg.deleteFile(inputFileName);
          await ffmpeg.deleteFile(outputFileName);
          await ffmpeg.deleteFile(stickerFileName);

          setProgress(((i + 1) / totalVideos) * 100);
        } catch (error) {
          console.error(`Erreur lors du traitement de la vidéo ${video.name}:`, error);
          toast.error(`Erreur lors du traitement de ${video.name}`);
        }
      }

      setCurrentFile("Création du fichier ZIP...");
      const content = await zip.generateAsync({
        type: "blob",
        compression: "STORE",
      });

      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "videos_with_stickers.zip";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Vidéos téléchargées avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
      setProgress(0);
      setCurrentFile("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Personnalisez vos vidéos
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-2">
              Ajoutez des stickers à vos vidéos en quelques clics
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr,1fr] gap-6 sm:gap-8">
          <div className="space-y-4">
            <Card className="p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold">Zone de travail</h2>
                {selectedSticker && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Taille du sticker
                      </span>
                      <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setStickerSize(Math.max(0.1, stickerSize - 0.05))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setStickerSize(Math.min(1, stickerSize + 0.05))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm text-muted-foreground">Zoom</span>
                      <div className="flex items-center gap-2 ml-auto sm:ml-0">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setScale(Math.min(2, scale + 0.1))}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {selectedVideo ? (
                  <VideoCanvas
                    key={selectedVideo.id}
                    video={selectedVideo.data}
                    sticker={selectedSticker}
                    scale={scale}
                    stickerSize={stickerSize}
                    position={stickerPosition}
                    onPositionChange={setStickerPosition}
                    onCanvasSize={setCanvasSize}
                  />
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <span className="text-muted-foreground text-center px-4">
                      Cliquez pour télécharger des vidéos
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="video/*"
                      multiple
                      onChange={handleVideoUpload}
                    />
                  </label>
                )}
              </div>
            </Card>

            {videos.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Vos vidéos ({videos.length})</h3>
                <ScrollArea className="h-32">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4 pr-4">
                    {videos.map((video) => (
                      <Card
                        key={video.id}
                        className={cn(
                          "relative aspect-video cursor-pointer transition-all",
                          selectedVideoId === video.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedVideoId(video.id)}
                      >
                        <video src={video.data} className="w-full h-full object-cover rounded-lg" />
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="w-full sm:w-auto sm:flex-1"
                onClick={() => {
                  setVideos([]);
                  setSelectedVideoId(null);
                  setSelectedSticker(null);
                  setStickerPosition({ x: 0, y: 0 });
                }}
                variant="destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Tout réinitialiser
              </Button>
              <Button
                className="w-full sm:w-auto sm:flex-1"
                onClick={handleDownload}
                disabled={!videos.length || !selectedSticker || isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger en ZIP
                  </>
                )}
              </Button>
            </div>
          </div>

          <Card className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Stickers</h2>
            <StickerSelector onSelect={setSelectedSticker} selected={selectedSticker} />
          </Card>
        </div>
      </div>

      <ProgressDialog
        open={isDownloading}
        title="Traitement des vidéos"
        description="Veuillez patienter pendant le traitement de vos vidéos..."
        progress={progress}
        currentFile={currentFile}
      />

      <Toaster />
    </main>
  );
}
