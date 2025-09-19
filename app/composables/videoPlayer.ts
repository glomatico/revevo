import Hls from 'hls.js';

export const useVideoPlayer = () => {
  const { loadSettings, settings } = useSettings();

  const htmlVideo = ref(null as HTMLVideoElement | null);
  const hlsInstance = ref(null as Hls | null);
  const load = ref(false);
  const streamUrl = ref('');
  const captionsUrl = ref('');

  const attachCaptions = async () => {
    if (!load.value) return;

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

    htmlVideo.value!.innerHTML = '';
    htmlVideo.value!.appendChild(track);

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
    if (hlsInstance.value) {
      hlsInstance.value.destroy();
      hlsInstance.value = null;
    }

    hlsInstance.value = new Hls();
    hlsInstance.value.loadSource(streamUrl.value!);
    hlsInstance.value.attachMedia(htmlVideo.value!);
    hlsInstance.value.on(Hls.Events.MANIFEST_PARSED, function () {
      htmlVideo.value?.play();
    });
  };

  const attachNormalVideo = async () => {
    htmlVideo.value!.src = streamUrl.value!;
    htmlVideo.value!.play();
  };

  const unloadVideo = () => {
    htmlVideo.value!.src = '';
  };

  const attachVideo = async () => {
    if (!load.value) {
      unloadVideo();
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
    load,
    htmlVideo,
    streamUrl,
    captionsUrl,
  };
}
