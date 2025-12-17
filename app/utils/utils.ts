
export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};

export const isVideoValid = (
  video: any,
  options: any = {},
): boolean => {
  const {
    hidePseudoCountryIsrc = false,
    hideExplicit = false,
    hideLyricVideos = false,
    checkStreams = false,
  } = options;

  if (!video?.title) {
    return false;
  }

  if (checkStreams && !video?.hls && !video?.mp4) {
    return false;
  }

  if (hidePseudoCountryIsrc && video?.id && PSEUDO_COUNTRY_ISRC_PREFIXES.includes(video.id.substring(0, 2))) {
    return false;
  }

  if (hideExplicit && video?.explicit) {
    return false;
  }

  if (hideLyricVideos && video?.lyricVideo) {
    return false;
  }

  return true;
};

export const isArtistValid = (artist: any): boolean => {
  return Boolean(artist?.name);
};
