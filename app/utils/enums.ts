export enum PlaybackMethod {
  HLS = "hls",
  MP4 = "mp4",
};

export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "loaded",
  ERROR = "error",
};

export interface Settings {
  playbackMethod: PlaybackMethod;
  enableCaptions: boolean;
  hidePseudoCountryIsrc: boolean;
}
