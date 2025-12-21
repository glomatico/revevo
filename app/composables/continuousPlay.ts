export const useContinuousPlay = () => {
  const router = useRouter();
  const route = useRoute();
  const vevoTvApi = useVevoTvApi();
  const {
    settings,
    loadSettings,
  } = useSettings();
  loadSettings();

  const continuousPlay = ref<any>(null);
  const allItemsLoaded = ref(false);
  const items = ref<any[]>([]);

  const loadingState = ref(LoadingState.IDLE);
  const videoId = ref('');
  const currentVideoId = computed(() => route.query.v as string || '');
  const mappedItems = computed(() => {
    return items.value.map((item: any) => item.video);
  });
  const title = computed(() => continuousPlay.value?.title || '');


  const loadContinuousPlayData = async () => {
    const response = await vevoTvApi.getContinuousPlay(
      videoId.value,
      items.value.length,
      32,
      !settings.value.hideExplicit,
    );
    continuousPlay.value = response?.data?.continuousPlay;

    const newItems = continuousPlay.value?.items || [];
    if (newItems.length === 0) {
      allItemsLoaded.value = true;
      return;
    }
    items.value.push(...newItems);
  };

  const loadContinuousPlay = async () => {
    loadingState.value = LoadingState.LOADING;

    try {
      await loadContinuousPlayData();
    } catch (error) {
      console.error('Error loading continuous play data:', error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const loadContinuousPlayScroll = async ({ done }: any) => {
    if (allItemsLoaded.value) {
      done('empty');
      return;
    }

    try {
      await loadContinuousPlayData();
      done('ok');
    } catch (error) {
      console.error('Error loading continuous play data:', error);
      done('error');
    }
  };

  const playNextVideo = async () => {
    const currentIndex = items.value.findIndex((item: any) => item.video.id === currentVideoId.value);

    if (currentIndex === -1) {
      return;
    }

    if (currentIndex + 1 >= items.value.length && !allItemsLoaded.value) {
      try {
        await loadContinuousPlayData();
      } catch (error) {
        console.error('Error loading continuous play data for next video:', error);
        return;
      }
    }

    if (currentIndex + 1 >= items.value.length) {
      return;
    }

    const nextVideoId = items.value[currentIndex + 1].video.id;
    router.push({
      name: 'video',
      query: { v: nextVideoId },
    });
  };

  return {
    loadingState,
    videoId,
    currentVideoId,
    mappedItems,
    title,
    loadContinuousPlay,
    loadContinuousPlayScroll,
    playNextVideo,
  };
}
