"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import { useEffect, useRef, useState } from "react";

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ffmpegRef = useRef(new FFmpeg());

  useEffect(() => {
    let mounted = true;
    const ffmpeg = ffmpegRef.current;

    const load = async () => {
      if (loaded) return;

      try {
        if (!crossOriginIsolated) {
          throw new Error(
            "Votre navigateur ne supporte pas les fonctionnalités requises. Veuillez utiliser un navigateur récent."
          );
        }

        await ffmpeg.load({
          coreURL: await toBlobURL(
            "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js",
            "text/javascript"
          ),
          wasmURL: await toBlobURL(
            "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm",
            "application/wasm"
          ),
          workerURL: await toBlobURL(
            "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.worker.js",
            "text/javascript"
          ),
        });

        if (mounted) {
          setLoaded(true);
          setError(null);
        }
      } catch (err) {
        console.error("Erreur FFmpeg:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Erreur lors du chargement de FFmpeg");
          setLoaded(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [loaded]);

  return { ffmpeg: ffmpegRef.current, loaded, error };
}
