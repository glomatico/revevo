import { MediaPlayerElement } from 'vidstack/elements';

export const useVideoPlayer = () => {
  const { loadSettings, settings } = useSettings();

  const videoPlayer = ref<MediaPlayerElement | null>(null);
  const captionsEventHandler = (e: Event) => {
    settings.value.enableCaptions = videoPlayer.value!.textTracks[0]?.mode === 'showing';
  };

  const attachCaptions = async (captionsUrl: string) => {
    const response = await fetch(captionsUrl);
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

  const attachVideo = async (streamUrl: string) => {
    videoPlayer.value!.src = streamUrl;
    videoPlayer.value!.addEventListener('can-play', () => {
      videoPlayer.value!.play();
    });
  };

  const unloadVideoPlayer = async () => {
    videoPlayer.value!.removeEventListener('text-track-change', captionsEventHandler);
    videoPlayer.value!.src = '';
    videoPlayer.value!.textTracks.clear();
  };

  const loadVideoPlayer = async (streamUrl: string, captionsUrl: string) => {
    loadSettings();

    await attachCaptions(captionsUrl);
    await attachVideo(streamUrl);
  };

  return {
    videoPlayer,
    loadVideoPlayer,
    unloadVideoPlayer,
  };
}