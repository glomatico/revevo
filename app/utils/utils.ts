
export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};

export const isVideoValid = (
  video: any,
): boolean => {
  if (!video?.title) {
    return false;
  }

  if (!video?.hls && !video?.mp4) {
    return false;
  }

  return true;
};

export const isArtistValid = (artist: any): boolean => {
  return Boolean(artist?.name);
};
