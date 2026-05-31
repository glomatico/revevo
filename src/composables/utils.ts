import { LoadingState } from "./enums";
import type { LoadResult } from "./types";

export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return (
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
};

export const isArtistValid = (artist: any): boolean => {
  return Boolean(artist?.name);
};

export const isVideoValid = (video: any): boolean => {
  return Boolean(video?.id && video?.title);
};

export const isPlaylistValid = (playlist: any): boolean => {
  return Boolean(playlist?.id && playlist?.title);
};

export const createLoadResult = <T>(result: T | null = null): LoadResult<T> => {
  return {
    loadingState: LoadingState.IDLE,
    result,
    errorMessage: null,
  };
};
