
export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};


export const isVideoValid = (
  video: any,
  hidePseudoCountryIsrc: boolean = false,
  hideExplicit: boolean = false,
  hideLyricVideos: boolean = false,
  checkStreams: boolean = false,
): boolean => {
  return Boolean(
    video?.title
    &&
    (!checkStreams || (video?.hls || video?.mp4))
    &&
    (!hidePseudoCountryIsrc || !PSEUDO_COUNTRY_ISRC_PREFIXES.includes(video?.id.substring(0, 2)))
    &&
    (!hideExplicit || !video?.isExplicit)
    &&
    (!hideLyricVideos || !video?.isLyric)
  );
};

export const isArtistValid = (artist: any): boolean => {
  return Boolean(artist?.name);
};
