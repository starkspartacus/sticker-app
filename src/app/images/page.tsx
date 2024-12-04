"use client";

import ImageCanvas from "@/components/ImageCanvas";
import StickerSelector from "@/components/StickerSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import JSZip from "jszip";
import { Download, Minus, Plus, Trash2, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ImageItem {
  id: string;
  data: string;
  name: string;
}

interface StickerPosition {
  x: number;
  y: number;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [stickerPosition, setStickerPosition] = useState<StickerPosition>({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDownloading, setIsDownloading] = useState(false);
  const [stickerSize, setStickerSize] = useState(0.3);

  const selectedImage = images.find((img) => img.id === selectedImageId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages((prev) => [
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
      toast.success(`${files.length} image(s) téléchargée(s)`);
      if (!selectedImageId) {
        setTimeout(() => {
          const firstImage = files[0];
          const reader = new FileReader();
          reader.onload = () => {
            setSelectedImageId(Math.random().toString(36).substring(7));
          };
          reader.readAsDataURL(firstImage);
        }, 100);
      }
    }
  };

  const handleDownload = async () => {
    if (!images.length) return;
    setIsDownloading(true);

    try {
      const zip = new JSZip();
      const canvasPromises = images.map((img) => {
        return new Promise<void>((resolve) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const image = new Image();

          image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx?.drawImage(image, 0, 0);

            if (selectedSticker) {
              const sticker = new Image();
              sticker.onload = () => {
                const stickerBaseSize = Math.min(canvas.width, canvas.height) * stickerSize * scale;
                const xRatio = stickerPosition.x / canvasSize.width;
                const yRatio = stickerPosition.y / canvasSize.height;

                const newX = canvas.width * xRatio;
                const newY = canvas.height * yRatio;

                ctx?.drawImage(sticker, newX, newY, stickerBaseSize, stickerBaseSize);

                const imageData = canvas.toDataURL("image/png");
                const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
                const imageName = img.name.replace(/\.[^/.]+$/, "") + "_with_sticker.png";
                zip.file(imageName, base64Data, { base64: true });
                resolve();
              };
              sticker.src = selectedSticker;
            } else {
              resolve();
            }
          };
          image.src = img.data;
        });
      });

      await Promise.all(canvasPromises);
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "images_with_stickers.zip";
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success("Images téléchargées avec succès");
    } catch {
      toast.error("Erreur lors du téléchargement");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Personnalisez vos images
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mt-2">
              Ajoutez des stickers à vos images en quelques clics
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
                {selectedImage ? (
                  <ImageCanvas
                    key={selectedImage.id}
                    image={selectedImage.data}
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
                      Cliquez pour télécharger des images
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </Card>

            {images.length > 0 && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Vos images ({images.length})</h3>
                <ScrollArea className="h-32">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-4 pr-4">
                    {images.map((img) => (
                      <Card
                        key={img.id}
                        className={cn(
                          "relative aspect-square cursor-pointer transition-all",
                          selectedImageId === img.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedImageId(img.id)}
                      >
                        <img
                          src={img.data}
                          alt={img.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
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
                  setImages([]);
                  setSelectedImageId(null);
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
                disabled={images.length === 0 || isDownloading}
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
      <Toaster />
    </main>
  );
}
