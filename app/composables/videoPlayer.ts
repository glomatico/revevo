import Hls from 'hls.js';

export const useVideoPlayer = (settings: Settings | null) => {
  const htmlVideo = ref<HTMLVideoElement>();
  const streamUrl = ref<string | null>();
  const captionsUrl = ref<string | null>();

  const addCaptionsEventListener = () => {
    if (!settings) return;

    htmlVideo.value!.textTracks.addEventListener('change', () => {
      const tracks = htmlVideo.value?.textTracks;
      if (!tracks) return;

      Array.from(tracks).forEach((track) => {
        if (track.kind !== 'subtitles') return;
        settings.enableCaptions = track.mode === 'showing';
      });
    });
  };

  const attachCaptions = async () => {
    if (!captionsUrl.value) return;

    const response = await fetch(captionsUrl.value);
    if (!response.ok) return;

    const blob = new Blob([await response.text()], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);

    const track = document.createElement('track') as HTMLTrackElement;

    track.kind = 'subtitles';
    track.label = 'Unknown Language';
    track.src = url;
    track.default = false;

    htmlVideo.value!.appendChild(track);

    toggleCaptionsFromStorage();
  };

  const toggleCaptionsFromStorage = async () => {
    Array.from(htmlVideo.value!.textTracks).forEach((track) => {
      if (track.kind === 'subtitles') {
        track.mode = settings?.enableCaptions! ? 'showing' : 'hidden';
      }
    });
  };

  const attachHlsVideo = async () => {
    if (!htmlVideo.value) return;

    const hls = new Hls();
    hls.loadSource(streamUrl.value!);
    hls.attachMedia(htmlVideo.value);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      htmlVideo.value?.play();
    });
  };

  const attachNormalVideo = async () => {
    if (!htmlVideo.value) return;

    htmlVideo.value.src = streamUrl.value!;
    htmlVideo.value.play();
  };

  const attachVideo = async () => {
    if (settings?.playbackMethod === PlaybackMethod.MP4) {
      await attachNormalVideo();
    } else {
      await attachHlsVideo();
    }
  };

  const loadVideoPlayer = async (
  ) => {
    await attachVideo();
    await attachCaptions();

    addCaptionsEventListener();
  };

  return {
    loadVideoPlayer,
    streamUrl,
    captionsUrl,
    htmlVideo,
  };
}
