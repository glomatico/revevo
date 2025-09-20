import { MediaPlayerElement } from 'vidstack/elements';

export const useVideoPlayer = () => {
  const { loadSettings, settings } = useSettings();

  const videoPlayer = ref<MediaPlayerElement | null>(null);
  const streamUrl = ref('');
  const captionsUrl = ref('');
  const captionsEventHandler = (e: Event) => {
    settings.value.enableCaptions = videoPlayer.value!.textTracks[0]?.mode === 'showing';
  };

  const attachCaptions = async () => {
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
    videoPlayer.value!.src = streamUrl.value;
    videoPlayer.value!.addEventListener('can-play', () => {
      videoPlayer.value!.play();
    });
  };

  const unloadVideoPlayer = async () => {
    videoPlayer.value!.removeEventListener('text-track-change', captionsEventHandler);
    videoPlayer.value!.src = '';
    videoPlayer.value!.textTracks.clear();
  };

  const loadVideoPlayer = async () => {
    loadSettings();

    await attachCaptions();
    await attachVideo();
  };

  return {
    loadVideoPlayer,
    unloadVideoPlayer,
    videoPlayer,
    streamUrl,
    captionsUrl,
  };
}