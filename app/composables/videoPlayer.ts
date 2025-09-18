import Hls from 'hls.js';

export const useVideoPlayer = () => {
  const { loadSettings, settings } = useSettings();

  const htmlVideo = ref(null as HTMLVideoElement | null);
  const streamUrl = ref('');
  const captionsUrl = ref('');

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

    htmlVideo.value!.innerHTML = track.outerHTML;

    toggleCaptionsFromStorage();
    addCaptionsEventListener();
  };

  const toggleCaptionsFromStorage = async () => {
    Array.from(htmlVideo.value!.textTracks).forEach((track) => {
      if (track.kind === 'subtitles') {
        track.mode = settings.value.enableCaptions! ? 'showing' : 'hidden';
      }
    });
  };

  const addCaptionsEventListener = () => {
    if (!settings) return;

    htmlVideo.value!.textTracks.addEventListener('change', () => {
      const tracks = htmlVideo.value?.textTracks;
      if (!tracks) return;

      Array.from(tracks).forEach((track) => {
        if (track.kind !== 'subtitles') return;
        settings.value.enableCaptions = track.mode === 'showing';
      });
    });
  };

  const attachHlsVideo = async () => {
    const hls = new Hls();
    hls.loadSource(streamUrl.value!);
    hls.attachMedia(htmlVideo.value!);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      htmlVideo.value?.play();
    });
  };

  const attachNormalVideo = async () => {
    htmlVideo.value!.src = streamUrl.value!;
    htmlVideo.value!.play();
  };

  const attachVideo = async () => {
    if (!streamUrl.value) {
      Array.from(htmlVideo.value!.textTracks).forEach((track) => {
        track.mode = 'disabled';
      });
      htmlVideo.value!.src = '';
      return;
    }

    if (settings.value.playbackMethod === PlaybackMethod.MP4) {
      await attachNormalVideo();
    } else {
      await attachHlsVideo();
    }
  };

  const loadVideoPlayer = async () => {
    loadSettings();

    await attachVideo();
    await attachCaptions();

  };

  return {
    loadVideoPlayer,
    htmlVideo,
    streamUrl,
    captionsUrl,
  };
}
