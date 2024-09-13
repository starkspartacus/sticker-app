import React, { useEffect, useRef } from "react";
import videojs, { VideoJsPlayer } from "video.js";

import "video.js/dist/video-js.css";

/**
 * @typedef {Object} VideoPlayerProps
 * @property {string} src
 * @property {string} [poster]
 * @property {boolean} [controls]
 * @property {boolean} [autoplay]
 * @property {'auto' | 'metadata' | 'none'} [preload]
 */

/**
 * @param {VideoPlayerProps} props
 */
const VideoPlayer = ({
  src,
  poster,
  controls = true,
  autoplay = false,
  preload = "auto",
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls,
        autoplay,
        preload,
        poster,
        sources: [{ src, type: "video/mp4" }],
      });

      return () => {
        if (playerRef.current) {
          playerRef.current.dispose();
        }
      };
    }
  }, [src, poster, controls, autoplay, preload]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
