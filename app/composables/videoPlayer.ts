import { MediaPlayerElement } from 'vidstack/elements';

export const useVideoPlayer = () => {
  const { loadSettings, settings } = useSettings();

  const streamUrl = ref<string | null>(null);
  const captionsUrl = ref<string | null>(null);
  const videoPlayer = ref<MediaPlayerElement | null>(null);
  const captionsEventHandler = (e: Event) => {
    settings.value.enableCaptions = videoPlayer.value!.textTracks[0]?.mode === 'showing';
  };

  const attachCaptions = async () => {
    if (!captionsUrl.value) return;

    const response = await fetch(captionsUrl.value);
    if (!response.ok) return;

    const blob = new Blob([await response.text()], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);

    videoPlayer.value!.textTracks.add({
      src: url,
      kind: 'subtitles',
      label: 'Unknown Language',
    });

    videoPlayer.value!.textTracks[0]?.setMode(settings.value.enableCaptions ? 'showing' : 'hidden');
    videoPlayer.value!.addEventListener('text-track-change', captionsEventHandler);
  };

  const attachVideo = async () => {
    if (!streamUrl.value) return;

    videoPlayer.value!.src = streamUrl.value;
    videoPlayer.value!.addEventListener('can-play', () => {
      videoPlayer.value!.play();
    });
  };

  const loadVideoPlayer = async () => {
    await attachVideo();
    await attachCaptions();
  };

  const unloadVideoPlayer = async () => {
    videoPlayer.value!.removeEventListener('text-track-change', captionsEventHandler);
    videoPlayer.value!.src = '';
    videoPlayer.value!.textTracks.clear();
  };

  const initialize = async () => {
    loadSettings();

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
    videoPlayer,
    loadVideoPlayer,
    unloadVideoPlayer,
    initialize,
    initializeWatcher,
  };
}
