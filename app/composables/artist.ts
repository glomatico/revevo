export const useArtist = () => {
  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();
  loadSettings();

  const videos = ref<any[]>([]);
  const hasLoadedAllVideos = ref(false);

  const loadingStateArtist = ref(LoadingState.IDLE);
  const loadingStateVideos = ref(LoadingState.IDLE);
  const artistId = ref('');
  const artist = ref<any>(null);
  const sortVideos = ref(null);

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
      32,
      !settings.value.hideExplicit,
    );
    artist.value = response?.data?.artist;
    videos.value = artist.value?.videos?.items || [];
  };

  const loadVideosData = async () => {
    const response = await vevoTvApi.getArtistVideos(
      artistId.value,
      videos.value.length,
      32,
      !settings.value.hideExplicit,
    );
    const pageVideos = response?.data?.artist?.videos?.items || [];
    if (pageVideos.length === 0) {
      hasLoadedAllVideos.value = true;
      return;
    }
    videos.value.push(...pageVideos);
  };

  const loadArtist = async () => {
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

  const loadVideosScroll = async ({ done }: any) => {
    if (hasLoadedAllVideos.value) {
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

  const loadAllVideos = async () => {
    loadingStateVideos.value = LoadingState.LOADING;

    try {
      while (!hasLoadedAllVideos.value) {
        await loadVideosData();
      }
    } catch (error) {
      console.error('Error loading all artist videos:', error);
      loadingStateVideos.value = LoadingState.ERROR;
      return;
    }

    loadingStateVideos.value = LoadingState.SUCCESS;
  };

  return {
    loadingStateArtist,
    loadingStateVideos,
    artistId,
    artist,
    sortVideos,
    filteredVideos,
    validArtist,
    loadArtist,
    loadVideosScroll,
    loadAllVideos,
  };
};
