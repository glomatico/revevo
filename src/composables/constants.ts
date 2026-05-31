import { PlaybackMethod } from "./enums";
import type { AppSettings } from "./types";

export const DEFAULT_SETTINGS: AppSettings = {
  playbackMethod: PlaybackMethod.HLS,
  enableCaptions: false,
  disableAutoplay: false,
  hideExplicit: false,
};
