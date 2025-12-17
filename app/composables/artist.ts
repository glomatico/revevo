export const useArtist = () => {
  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();

  const videos = ref<any[]>([]);
  const hasLoadedAllVideos = ref(false);

  const loadingStateArtist = ref(LoadingState.IDLE);
  const loadingStateVideos = ref(LoadingState.IDLE);
  const artistId = ref('');
  const artist = ref<any>(null);
  const sortVideos = ref('normal');

  const filteredVideos = computed(() => {
    const filtered = videos.value.filter((video) => {
      if (!isVideoValid(
        video,
        settings.value.hidePseudoCountryIsrc,
        settings.value.hideExplicit,
        settings.value.hideLyricVideos,
      )) {
        return false;
      }
      return true;
    });

    if (sortVideos.value === 'views') {
      return filtered.sort((a, b) => (b?.viewCounts?.total || 0) - (a?.viewCounts?.total || 0));
    }
    if (sortVideos.value === 'date') {
      return filtered.sort((a, b) => new Date(b?.created || 0).getTime() - new Date(a?.created || 0).getTime());
    }
    if (sortVideos.value === 'a-z') {
      return filtered.sort((a, b) => {
        const titleA = a?.title?.toLowerCase() || '';
        const titleB = b?.title?.toLowerCase() || '';
        return titleA.localeCompare(titleB);
      });
    }

    return filtered;
  });
  const validArtist = computed(() => isArtistValid(artist.value));

  const loadArtistData = async () => {
    const response = await vevoTvApi.getArtist(artistId.value);
    artist.value = response?.data?.artist;
    videos.value = artist.value?.videos?.items || [];
  };

  const loadVideosData = async () => {
    const response = await vevoTvApi.getArtistVideos(artistId.value, videos.value.length);
    const pageVideos = response?.data?.artist?.videos?.items || [];
    videos.value.push(...pageVideos);
  };

  const loadArtist = async () => {
    loadingStateArtist.value = LoadingState.LOADING;
    try {
      loadSettings();
      await loadArtistData();
    } catch (error) {
      console.error('Error loading artist:', error);
      loadingStateArtist.value = LoadingState.ERROR;
      return;
    }

    loadingStateArtist.value = LoadingState.SUCCESS;
    loadingStateVideos.value = LoadingState.SUCCESS;
  };

  const loadVideos = async ({ done }: any) => {
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
    loadVideos,
    loadAllVideos,
  };
};
