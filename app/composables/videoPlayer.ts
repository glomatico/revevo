import { MediaPlayerElement } from 'vidstack/elements';

export const useVideoPlayer = (settings: Record<string, unknown> = DEFAULT_SETTINGS) => {
  const streamUrl = ref<string | null>(null);
  const captionsUrl = ref<string | null>(null);
  const videoPlayerElement = ref<MediaPlayerElement | null>(null);
  const onEnd = ref<(() => void) | null>(null);

  const captionsEventHandler = (e: Event) => {
    settings.enableCaptions = videoPlayerElement.value!.textTracks[0]?.mode === 'showing';
  };

  const attachCaptions = async () => {
    if (!captionsUrl.value) return;

    const response = await fetch(captionsUrl.value);
    if (!response.ok) return;

    const blob = new Blob([await response.text()], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);

    videoPlayerElement.value!.textTracks.add({
      src: url,
      kind: 'subtitles',
      label: 'Unknown Language',
    });

    videoPlayerElement.value!.textTracks[0]?.setMode(settings.enableCaptions ? 'showing' : 'hidden');
    videoPlayerElement.value!.addEventListener('text-track-change', captionsEventHandler);
  };

  const attachVideo = async () => {
    if (!streamUrl.value) return;

    videoPlayerElement.value!.src = streamUrl.value;
    videoPlayerElement.value!.addEventListener('can-play', () => {
      videoPlayerElement.value!.play();
    });
  };

  const loadVideoPlayer = async () => {
    await attachVideo();
    await attachCaptions();
  };

  const unloadVideoPlayer = async () => {
    videoPlayerElement.value!.removeEventListener('text-track-change', captionsEventHandler);
    videoPlayerElement.value!.src = '';
    videoPlayerElement.value!.textTracks.clear();
  };

  const initialize = async () => {
    if (onEnd.value) {
      videoPlayerElement.value!.addEventListener('ended', onEnd.value);
    }

    await unloadVideoPlayer();
    await loadVideoPlayer();
  };

  const initializeWatcher = () => {
    watch(
      () => [streamUrl.value, captionsUrl.value],
      async () => {
        await initialize();
      },
      { immediate: true },
    );
  }

  return {
    streamUrl,
    captionsUrl,
    videoPlayerElement,
    loadVideoPlayer,
    unloadVideoPlayer,
    initialize,
    initializeWatcher,
  };
}
