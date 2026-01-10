export const useSearch = () => {
  const route = useRoute();

  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();

  const allVideosLoaded = ref<boolean>(false);
  const allArtistsLoaded = ref<boolean>(false);
  const allPlaylistsLoaded = ref<boolean>(false);
  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const query = ref<string>('');
  const videos = ref<any[]>([]);
  const artists = ref<any[]>([]);
  const playlists = ref<any[]>([]);

  const routeQuery = computed<string>(() => (route.query.q as string) || '');

  const loadSearchData = async () => {
    const response = await vevoTvApi.search(
      query.value,
      videos.value.length,
      DEFAULT_API_LIMIT,
      artists.value.length,
      DEFAULT_API_LIMIT,
      playlists.value.length,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );

    const videosResponse = response?.data?.videoSearch?.items || [];
    videos.value.push(...videosResponse);
    if (
      videos.value.length >= response?.data?.videoSearch?.itemsCount ||
      videosResponse.length < DEFAULT_API_LIMIT ||
      videosResponse.length === 0
    ) {
      allVideosLoaded.value = true;
    }

    const artistsResponse = response?.data?.artistSearch?.items || [];
    artists.value.push(...artistsResponse);
    if (
      artists.value.length >= response?.data?.artistSearch?.itemsCount ||
      artistsResponse.length < DEFAULT_API_LIMIT ||
      artistsResponse.length === 0
    ) {
      allArtistsLoaded.value = true;
    }

    const playlistsResponse = response?.data?.playlistSearch?.items || [];
    playlists.value.push(...playlistsResponse);
    if (
      playlists.value.length >= response?.data?.playlistSearch?.itemsCount ||
      playlistsResponse.length < DEFAULT_API_LIMIT ||
      playlistsResponse.length === 0
    ) {
      allPlaylistsLoaded.value = true;
    }
  };

  const loadSearchVideoScroll = async ({ done }: any) => {
    if (allVideosLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadSearchData();
      done('ok');
    }
    catch (error) {
      console.error('Error loading search videos:', error);
      done('error');
    }
  };

  const loadSearchArtistScroll = async ({ done }: any) => {
    if (allArtistsLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadSearchData();
      done('ok');
    } catch (error) {
      console.error('Error loading search artists:', error);
      done('error');
    }
  };

  const loadSearchPlaylistScroll = async ({ done }: any) => {
    if (allPlaylistsLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadSearchData();
      done('ok');
    } catch (error) {
      console.error('Error loading search playlists:', error);
      done('error');
    }
  };

  const initialize = async () => {
    loadSettings();

    videos.value = [];
    artists.value = [];
    playlists.value = [];
    allVideosLoaded.value = false;
    allArtistsLoaded.value = false;
    allPlaylistsLoaded.value = false;

    loadingState.value = LoadingState.LOADING;

    try {
      await loadSearchData();
    } catch (error) {
      console.error('Error loading search data:', error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const initializeWatcher = () => {
    watch(
      () => routeQuery.value, async () => {
        query.value = routeQuery.value;
        window.scrollTo(0, 0);
        await initialize();
      }, { immediate: true }
    )
  };

  return {
    allVideosLoaded,
    allArtistsLoaded,
    allPlaylistsLoaded,
    loadingState,
    query,
    videos,
    artists,
    playlists,
    loadSearchVideoScroll,
    loadSearchArtistScroll,
    loadSearchPlaylistScroll,
    initialize,
    initializeWatcher,
  };
};
