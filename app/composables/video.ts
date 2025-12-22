export const useVideo = () => {
  const route = useRoute();
  const router = useRouter();

  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();

  const streamUrl = ref('');
  const captionsUrl = computed(() => `/api/captions/${videoId.value}`);

  const loadingState = ref(LoadingState.IDLE);
  const videoId = ref('');
  const video = ref<any>(null);
  const validVideo = computed(() => isVideoValid(
    video.value,
    {
      checkStreams: true,
    }
  ));
  const videoPlayer = ref<any>(null);
  const continuousPlay = ref<any>(null);
  const playlist = ref<any>(null);

  const getBestMp4Stream = (): string => {
    const mp4Streams = (video.value?.mp4 || []) as any[];
    const qualityPriority = ['high', 'medium', 'low'];

    for (const quality of qualityPriority) {
      const stream = mp4Streams.find(stream => stream?.quality === quality);
      if (stream) return stream?.url;
    }

    return '';
  };

  const loadStreamUrl = () => {
    if (settings.value.playbackMethod === PlaybackMethod.MP4) {
      streamUrl.value = getBestMp4Stream();
    } else {
      streamUrl.value = video.value?.hls
    }
  };

  const loadVideoData = async () => {
    const response = await vevoTvApi.getVideo(videoId.value);
    video.value = response.data?.video;
  };

  const loadVideo = async () => {
    loadSettings();

    loadingState.value = LoadingState.LOADING;

    try {
      await loadVideoData();

      if (validVideo.value) {
        loadStreamUrl();
      }

      loadingState.value = LoadingState.SUCCESS;
    } catch (error) {
      console.error('Error loading video:', error);
      loadingState.value = LoadingState.ERROR;
    }
  };

  const initializeWatcher = () => {
    watch(
      () => route.query.v,
      async (newVideoId) => {
        videoId.value = newVideoId as string;
        window.scrollTo(0, 0);
        await videoPlayer.value?.unloadVideoPlayer();
        await loadVideo();
        if (validVideo.value) {
          await videoPlayer.value?.loadVideoPlayer(streamUrl.value, captionsUrl.value);
        }
      },
      { immediate: true }
    );
  };

  const playNextVideo = async () => {
    if (settings.value.disableAutoplay) {
      return;
    }

    let nextVideoId;

    if (playlist.value != null) {
      nextVideoId = await playlist.value.getNextVideoId();
    } else if (continuousPlay.value != null) {
      nextVideoId = await continuousPlay.value.getNextVideoId();
    }

    if (nextVideoId != null) {
      router.push({
        name: 'video',
        query: { v: nextVideoId },
      });
    }
  };

  return {
    loadingState,
    videoId,
    video,
    validVideo,
    videoPlayer,
    continuousPlay,
    playlist,
    initializeWatcher,
    playNextVideo,
  };
};
