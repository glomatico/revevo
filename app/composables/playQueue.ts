export const usePlayQueue = () => {
  const route = useRoute();
  const router = useRouter();

  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();

  const allVideosLoaded = ref<boolean>(false);
  const videos = ref<any[]>([]);
  const playlistId = ref<string>('');
  const videoId = ref<string>('');
  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const title = ref<string>('');
  const videoIndex = ref<number>(0);

  const routeVideoId = computed<string>(() => (route.query.v as string) || '');
  const routePlaylistId = computed<string>(() => (route.query.p as string) || '');
  const routeVideoIndex = computed<number>(() => parseInt((route.query.i as string) || '1', 10));
  const mappedVideos = computed<any[]>(() => videos.value.map((item: any) => item.video));

  const loadPlaylistData = async () => {
    const response = await vevoTvApi.getContainerVideos(
      playlistId.value,
      videos.value.length,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );
    const playlist = response?.data?.container;

    title.value = playlist?.title || '';

    const pageVideos = playlist?.items || [];
    videos.value.push(...pageVideos);

    allVideosLoaded.value = videos.value.length >= playlist?.videos?.itemsCount || pageVideos.length < DEFAULT_API_LIMIT;
  };

  const loadContinuousPlayData = async () => {
    const response = await vevoTvApi.getContinuousPlay(
      videoId.value,
      videos.value.length,
      32,
      !settings.value.hideExplicit,
    );
    const continuousPlay = response?.data?.continuousPlay;

    title.value = continuousPlay?.title || '';

    const newVideos = continuousPlay?.items || [];
    videos.value.push(...newVideos);

    allVideosLoaded.value = videos.value.length >= continuousPlay?.items?.itemsCount || newVideos.length < DEFAULT_API_LIMIT;
  };

  const loadPlayQueueData = async () => {
    if (playlistId.value) {
      await loadPlaylistData();
    } else {
      await loadContinuousPlayData();
    }
  };

  const initializePlaylist = async () => {
    loadingState.value = LoadingState.LOADING;

    while (!allVideosLoaded.value && videos.value.length < (videoIndex.value + 1)) {
      try {
        await loadPlaylistData();
      } catch (error) {
        console.error('Error loading playlist data:', error);
        loadingState.value = LoadingState.ERROR;
        return;
      }
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const initializeContinuousPlay = async () => {
    loadingState.value = LoadingState.LOADING;

    while (!allVideosLoaded.value && videos.value.length < (videoIndex.value + 1)) {
      try {
        await loadContinuousPlayData();
      } catch (error) {
        console.error('Error loading continuous play data:', error);
        loadingState.value = LoadingState.ERROR;
        return;
      }
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const playNextVideo = async () => {
    while (!videos.value?.[videoIndex.value + 1] && !allVideosLoaded.value) {
      try {
        await loadPlayQueueData();
      } catch (error) {
        console.error('Error loading more videos for play next:', error);
        return;
      }
    }

    if (!videos.value?.[videoIndex.value + 1]) return;

    videoIndex.value += 1;

    router.replace({
      query: {
        ...route.query,
        i: `${videoIndex.value + 1}`,
        v: videos.value[videoIndex.value].video.id,
      },
    });
  };

  const scrollPlayQueue = async ({ done }: any) => {
    if (allVideosLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadPlayQueueData();
      done('ok');
    } catch (error) {
      console.error('Error loading more videos for play queue:', error);
      done('error');
    }
  };

  const initialize = async () => {
    loadSettings();

    videos.value = [];
    title.value = '';
    allVideosLoaded.value = false;

    if (playlistId.value) {
      await initializePlaylist();
    } else {
      await initializeContinuousPlay();
    }
  };

  const initializeFromRoute = async () => {
    playlistId.value = routePlaylistId.value;
    videoId.value = routeVideoId.value;
    videoIndex.value = routeVideoIndex.value - 1;

    await initialize();
  };

  return {
    allVideosLoaded,
    videos,
    playlistId,
    videoId,
    loadingState,
    title,
    videoIndex,
    routeVideoId,
    routePlaylistId,
    routeVideoIndex,
    mappedVideos,
    playNextVideo,
    scrollPlayQueue,
    initialize,
    initializeFromRoute,
  };
}
