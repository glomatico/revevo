export const useVideo = (
  settings: Record<string, unknown> = DEFAULT_SETTINGS,
  videoPlayer: null | ReturnType<typeof useVideoPlayer> = null,
) => {
  const route = useRoute();

  const vevoTvApi = useVevoTvApi();

  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const videoId = ref<string>('');
  const video = ref<any>(null);

  const captionsUrl = computed<string>(() => `/api/captions/${videoId.value}`);
  const validVideo = computed<boolean>(() => isVideoValid(video.value));
  const streamUrl = computed<string>(() => {
    if (!validVideo.value) return '';

    if (settings.playbackMethod === PlaybackMethod.MP4) {
      return getBestMp4Stream();
    } else {
      return video.value?.hls || '';
    }
  });
  const routeVideoId = computed<string>(() => (route.query.v as string) || '');

  const getBestMp4Stream = (): string => {
    const mp4Streams = (video.value?.mp4 || []) as any[];
    const qualityPriority = ['high', 'medium', 'low'];

    for (const quality of qualityPriority) {
      const stream = mp4Streams.find(stream => stream?.quality === quality);
      if (stream) return stream?.url;
    }

    return '';
  };

  const loadVideoData = async () => {
    const response = await vevoTvApi.getVideo(videoId.value);
    video.value = response.data?.video;
  };

  const initialize = async () => {
    video.value = null;

    loadingState.value = LoadingState.LOADING;

    try {
      await loadVideoData();
    } catch (error) {
      console.error('Error loading video:', error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };


  const initializeWatcher = () => {
    watch(
      () => [streamUrl.value, captionsUrl.value], () => {
        if (videoPlayer) {
          videoPlayer.streamUrl.value = streamUrl.value;
          videoPlayer.captionsUrl.value = captionsUrl.value;
        }
      }, { immediate: true }
    );

    watch(
      () => routeVideoId.value, async () => {
        videoId.value = routeVideoId.value;
        window.scrollTo(0, 0);
        await initialize();
      }, { immediate: true }
    );
  };

  return {
    loadingState,
    videoId,
    video,
    validVideo,
    captionsUrl,
    streamUrl,
    routeVideoId,
    initialize,
    initializeWatcher,
  };
};
