const { VideoEncoder } = require("ffmpeg.js");

self.onmessage = (event) => {
  const { files, stickerImage, zip } = event.data;
  const videoEncoder = new VideoEncoder({
    // Configure the video encoder
    codec: "h264",
    width: 640,
    height: 480,
    bitrate: 500000,
  });

  const videoChunks = [];
  let progress = 0;

  for (const file of files) {
    const videoFile = new File([file], file.name, file.type);
    const videoStream = new MediaStream();
    videoStream.addVideoTrack({
      kind: "video",
      track: new VideoTrack({
        kind: "video",
        width: 640,
        height: 480,
      }),
    });

    videoEncoder.encode(videoStream, (chunk) => {
      videoChunks.push(chunk);
      progress = (videoChunks.length / files.length) * 100;
      self.postMessage({ type: "progress", progress });
    });
  }

  videoEncoder.flush().then(() => {
    const videoBlob = new Blob(videoChunks, { type: "video/mp4" });
    self.postMessage({ type: "complete", videoBlob });
  });
};
