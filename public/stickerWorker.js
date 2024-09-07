self.onmessage = async (event) => {
  const { videoFile, stickerImage, position } = event.data;

  // Ajout du sticker à la vidéo (logique personnalisée ici)
  const processedVideoBlob = await processVideoWithSticker(
    videoFile,
    stickerImage,
    position
  );

  // Envoi de la vidéo traitée au thread principal
  self.postMessage({ success: true, processedVideoBlob });
};

// Exemple de fonction pour traiter la vidéo avec le sticker
async function processVideoWithSticker(videoFile, stickerImage, position) {
  // Votre logique de manipulation vidéo avec Canvas ou FFmpeg.js
  return new Blob(); // Retournez le Blob de la vidéo traitée
}
