import {
  nextTick,
  onBeforeUnmount,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from "vue";
import type { MediaPlayerElement } from "vidstack/elements";
import { useSettings } from "./useSettings";

export interface UseVideoPlayerOptions {
  captionsUrl?: MaybeRefOrGetter<string | undefined>;
  src: MaybeRefOrGetter<string>;
}

export const useVideoPlayer = (options: UseVideoPlayerOptions) => {
  const { settings } = useSettings();

  const playerElement = ref<MediaPlayerElement | null>(null);

  let captionsObjectUrl = "";
  let isSyncingCaptions = false;
  let isWatching = false;

  const getCaptionTrack = () => {
    const textTracks = playerElement.value?.textTracks;
    return textTracks?.getByKind(["captions", "subtitles"])?.[0] || null;
  };

  const applyCaptionSetting = () => {
    const track = getCaptionTrack();
    if (!track) {
      return;
    }

    track.setMode(settings.value.enableCaptions ? "showing" : "hidden");
  };

  const rememberCaptionSetting = () => {
    if (isSyncingCaptions) {
      return;
    }

    const track = getCaptionTrack();
    if (!track) {
      return;
    }

    settings.value.enableCaptions = track.mode === "showing";
  };

  const clearCaptions = () => {
    playerElement.value?.textTracks.clear();

    if (captionsObjectUrl) {
      URL.revokeObjectURL(captionsObjectUrl);
      captionsObjectUrl = "";
    }
  };

  const attachCaptions = async () => {
    const captionsUrl = toValue(options.captionsUrl);

    if (!captionsUrl || !playerElement.value) {
      return;
    }

    const response = await fetch(captionsUrl);
    if (!response.ok || !playerElement.value) {
      return;
    }

    const blob = new Blob([await response.text()], { type: "text/vtt" });
    captionsObjectUrl = URL.createObjectURL(blob);

    playerElement.value.textTracks.add({
      src: captionsObjectUrl,
      kind: "subtitles",
      label: "Captions",
      language: "en",
    });

    applyCaptionSetting();
  };

  const loadPlayer = async () => {
    await nextTick();

    if (!playerElement.value) {
      return;
    }

    isSyncingCaptions = true;

    try {
      clearCaptions();

      const src = toValue(options.src);
      playerElement.value.src = src;

      await attachCaptions();
      await nextTick();
    } finally {
      isSyncingCaptions = false;
    }
  };

  const initializeWatch = () => {
    if (isWatching) {
      return;
    }

    isWatching = true;

    watch(
      () => [toValue(options.src), toValue(options.captionsUrl)],
      () => {
        window.scrollTo(0, 0);
        void loadPlayer();
      },
      { immediate: true },
    );
  };

  return {
    applyCaptionSetting,
    initializeWatch,
    loadPlayer,
    playerElement,
    rememberCaptionSetting,
    settings,
  };
};
