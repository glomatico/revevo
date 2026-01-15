export const useVideoExtraInfo = () => {
  const vevoApi = useVevoApi();
  const route = useRoute();

  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const videoId = ref<string>('');
  const extraInfo = ref<any>(null);

  const routeVideoId = computed<string>(() => (route.params.id as string) || '');
  const isExtraInfoValid = computed<boolean>(() =>
    extraInfo.value?.basicMetaV3?.credits?.length > 0 || extraInfo.value?.views?.youTubeId
  );

  const loadExtraInfoData = async () => {
    const response = await vevoApi.getVideos([videoId.value]);
    const videos = response?.data?.videos?.data || [];
    extraInfo.value = videos.length > 0 ? videos[0] : null;
  };

  const initialize = async () => {
    extraInfo.value = null;

    loadingState.value = LoadingState.LOADING;

    try {
      await loadExtraInfoData();
    } catch (error) {
      console.error('Error loading extra video info:', error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const initializeFromRoute = async () => {
    videoId.value = routeVideoId.value;
    await initialize();
  };

  return {
    loadingState,
    videoId,
    extraInfo,
    routeVideoId,
    isExtraInfoValid,
    initialize,
    initializeFromRoute,
  };
}
