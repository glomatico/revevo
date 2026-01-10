export const usePlaylist = (settings: Record<string, unknown> = DEFAULT_SETTINGS) => {
  const route = useRoute();
  const vevoTvApi = useVevoTvApi();

  const videos = ref<any[]>([]);
  const allVideosLoaded = ref(false);
  const loadingState = ref(LoadingState.IDLE);
  const playlistId = ref('');
  const playlist = ref<any>(null);

  const validPlaylist = computed(() => isPlaylistValid(playlist.value));
  const mappedVideos = computed(() => videos.value.map(item => item.video));
  const routePlaylistId = computed<string>(() => (route.params.id as string) || '');

  const loadPlaylistData = async () => {
    const response = await vevoTvApi.getContainer(
      playlistId.value,
      0,
      DEFAULT_API_LIMIT,
      !settings.hideExplicit,
    );
    playlist.value = response?.data?.container;
    videos.value = playlist.value?.items || [];

    if (
      videos.value.length >= playlist.value?.itemsCount ||
      videos.value.length < DEFAULT_API_LIMIT ||
      videos.value.length === 0
    ) {
      allVideosLoaded.value = true;
    }
  };

  const loadPlaylistVideosData = async () => {
    const response = await vevoTvApi.getContainerVideos(
      playlistId.value,
      videos.value.length,
      DEFAULT_API_LIMIT,
      !settings.hideExplicit,
    );
    const pageVideos = response?.data?.container?.items || [];
    videos.value.push(...pageVideos);

    if (
      videos.value.length >= playlist.value?.itemsCount ||
      pageVideos.length < DEFAULT_API_LIMIT ||
      pageVideos.length === 0
    ) {
      allVideosLoaded.value = true;
    }
  };

  const loadPlaylistVideosScroll = async ({ done }: any) => {
    if (allVideosLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadPlaylistVideosData();
      done('ok');
    } catch (error) {
      console.error('Error loading playlist videos:', error);
      done('error');
    }
  };

  const initialize = async () => {
    playlist.value = null;
    videos.value = [];
    allVideosLoaded.value = false;

    loadingState.value = LoadingState.LOADING;

    try {
      await loadPlaylistData();
    } catch (error) {
      console.error('Error loading playlist data:', error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const initializeFromRoute = async () => {
    playlistId.value = routePlaylistId.value;
    await initialize();
  };

  return {
    videos,
    mappedVideos,
    loadingState,
    playlistId,
    playlist,
    validPlaylist,
    routePlaylistId,
    loadPlaylistVideosScroll,
    initialize,
    initializeFromRoute,
  }
}
