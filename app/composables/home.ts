export const useHome = (settings: Record<string, unknown> = DEFAULT_SETTINGS) => {
  const vevoTvApi = useVevoTvApi();

  const home = ref<any>(null);
  const loadingState = ref<LoadingState>(LoadingState.IDLE);

  const loadHomeData = async () => {
    const response = await vevoTvApi.getHome(
      DEFAULT_API_LIMIT,
      !settings.hideExplicit,
    );
    home.value = response?.data?.home;
  };

  const initialize = async () => {
    home.value = null;

    loadingState.value = LoadingState.LOADING;

    try {
      await loadHomeData();
    } catch (error) {
      console.error('Error loading homepage:', error);
      loadingState.value = LoadingState.ERROR;
      return;
    }
    loadingState.value = LoadingState.SUCCESS;
  };

  return {
    home,
    loadingState,
    initialize,
  };
}
