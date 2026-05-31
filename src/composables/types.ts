import { LoadingState, PlaybackMethod } from "./enums";

export interface AppSettings {
  playbackMethod: PlaybackMethod;
  enableCaptions: boolean;
  disableAutoplay: boolean;
  hideExplicit: boolean;
}

export interface ItemsResult {
  items: any[];
  isAllLoaded: boolean;
}

export interface SearchResults {
  videos: ItemsResult;
  artists: ItemsResult;
  playlists: ItemsResult;
}

export interface LoadResult<T> {
  loadingState: LoadingState;
  result: T | null;
  errorMessage: string | null;
}

export type SortOption = "views" | "date" | "a-z" | "original";
