export const useArtist = () => {
  const route = useRoute();

  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();

  const videos = ref<any[]>([]);
  const allVideosLoaded = ref<boolean>(false);
  const loadingStateArtist = ref(LoadingState.IDLE);
  const loadingStateVideos = ref(LoadingState.IDLE);
  const artistId = ref<string>('');
  const artist = ref<any>(null);
  const sortVideos = ref<string>('');

  const filteredVideos = computed(() => {
    if (sortVideos.value === 'views') {
      return videos.value.slice().sort((a, b) => (b?.viewCounts?.total || 0) - (a?.viewCounts?.total || 0));
    }

    if (sortVideos.value === 'date') {
      return videos.value.slice().sort((a, b) => new Date(b?.created || 0).getTime() - new Date(a?.created || 0).getTime());
    }

    if (sortVideos.value === 'a-z') {
      return videos.value.slice().sort((a, b) => {
        const titleA = a?.title?.toLowerCase() || '';
        const titleB = b?.title?.toLowerCase() || '';
        return titleA.localeCompare(titleB);
      });
    }

    return videos.value;
  });
  const validArtist = computed(() => isArtistValid(artist.value));

  const loadArtistData = async () => {
    const response = await vevoTvApi.getArtist(
      artistId.value,
      0,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );
    artist.value = response?.data?.artist;

    videos.value = artist.value?.videos?.items || [];
    allVideosLoaded.value = videos.value.length >= artist.value?.videos?.itemsCount || videos.value.length < DEFAULT_API_LIMIT;
  };

  const loadVideosData = async () => {
    const response = await vevoTvApi.getArtistVideos(
      artistId.value,
      videos.value.length,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );

    const pageVideos = response?.data?.artist?.videos?.items || [];
    videos.value.push(...pageVideos);
    allVideosLoaded.value = videos.value.length >= artist.value?.videos?.itemsCount || pageVideos.length < DEFAULT_API_LIMIT;
  };

  const loadAllVideos = async () => {
    loadingStateVideos.value = LoadingState.LOADING;

    try {
      while (!allVideosLoaded.value) {
        await loadVideosData();
      }
    } catch (error) {
      console.error('Error loading all artist videos:', error);
      loadingStateVideos.value = LoadingState.ERROR;
      return;
    }

    loadingStateVideos.value = LoadingState.SUCCESS;
  };

  const loadVideosScroll = async ({ done }: any) => {
    if (allVideosLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadVideosData();
      done('ok');
    } catch (error) {
      console.error('Error loading artist videos:', error);
      done('error');
    }
  };

  const initialize = async () => {
    loadSettings();

    artist.value = null;
    videos.value = [];
    allVideosLoaded.value = false;

    loadingStateArtist.value = LoadingState.LOADING;

    try {
      await loadArtistData();
    } catch (error) {
      console.error('Error loading artist:', error);
      loadingStateArtist.value = LoadingState.ERROR;
      return;
    }

    loadingStateArtist.value = LoadingState.SUCCESS;
    loadingStateVideos.value = LoadingState.SUCCESS;
  };

  const initializeFromRoute = async () => {
    artistId.value = route.params.id as string;

    await initialize();
  };

  return {
    videos,
    allVideosLoaded,
    loadingStateArtist,
    loadingStateVideos,
    artistId,
    artist,
    sortVideos,
    filteredVideos,
    validArtist,
    loadArtistData,
    loadVideosData,
    loadVideosScroll,
    loadAllVideos,
    initialize,
    initializeFromRoute,
  };
};
