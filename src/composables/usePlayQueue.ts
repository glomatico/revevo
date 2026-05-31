import { DEFAULT_API_LIMIT } from "@/lib/vevoTv/constants";
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { LoadingState, PlaybackMethod } from "./enums";
import { useSettings } from "./useSettings";
import { useVevoTvApi } from "./useVevoTvApi";
import { isVideoValid } from "./utils";

export const usePlayQueue = () => {
  const route = useRoute();
  const router = useRouter();

  const api = useVevoTvApi();
  const { settings } = useSettings();

  let isWatchingRoute = false;
  let isLoadingMoreVideos = false;

  const allVideosLoaded = ref(false);
  const videos = ref<any[]>([]);
  const playlistId = ref("");
  const videoId = ref("");
  const loadingState = ref(LoadingState.IDLE);
  const title = ref("");

  const routeVideoId = computed(() => {
    const id = route.params.id;
    return typeof id === "string" ? id : "";
  });
  const routePlaylistId = computed(() => {
    const id = route.query.p;
    return typeof id === "string" ? id : "";
  });
  const mappedVideos = computed(() => videos.value.map((item) => item.video));
  const currentVideo = computed(() =>
    mappedVideos.value.find((video) => video?.id === routeVideoId.value) || null,
  );
  const validCurrentVideo = computed(() => isVideoValid(currentVideo.value));
  const captionsUrl = computed(() => currentVideo.value?.captions?.vtt?.url || "");
  const streamUrl = computed(() => {
    if (!validCurrentVideo.value) {
      return "";
    }

    if (settings.value.playbackMethod === PlaybackMethod.MP4) {
      return getBestMp4Stream(currentVideo.value?.mp4 || []);
    }

    return currentVideo.value?.hls || getBestMp4Stream(currentVideo.value?.mp4 || []);
  });

  const getBestMp4Stream = (streams: any[]) => {
    const qualityPriority = ["high", "medium", "low"];

    for (const quality of qualityPriority) {
      const stream = streams.find((item) => item?.quality === quality);
      if (stream?.url) {
        return stream.url;
      }
    }

    return streams[0]?.url || "";
  };

  const loadPlaylistData = async () => {
    const response = await api.getContainerVideos(
      playlistId.value,
      videos.value.length,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );
    const playlist = response?.data?.container;
    const pageVideos = playlist?.items || [];
    const itemsCount = playlist?.itemsCount || 0;

    title.value = playlist?.title || "";
    videos.value.push(...pageVideos);
    allVideosLoaded.value =
      videos.value.length >= itemsCount || pageVideos.length < DEFAULT_API_LIMIT;
  };

  const loadContinuousPlayData = async () => {
    const response = await api.getContinuousPlay(
      videoId.value,
      videos.value.length,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );
    const continuousPlay = response?.data?.continuousPlay;
    const pageVideos = continuousPlay?.items || [];

    title.value = continuousPlay?.title || "";
    videos.value.push(...pageVideos);
    allVideosLoaded.value = pageVideos.length < DEFAULT_API_LIMIT;
  };

  const loadPlayQueueData = async () => {
    if (playlistId.value) {
      await loadPlaylistData();
      return;
    }

    await loadContinuousPlayData();
  };

  const initialize = async () => {
    videos.value = [];
    title.value = "";
    allVideosLoaded.value = false;
    loadingState.value = LoadingState.LOADING;

    try {
      do {
        await loadPlayQueueData();
      } while (videoId.value && !currentVideo.value && !allVideosLoaded.value);
    } catch (error) {
      console.error("Error loading play queue:", error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  const initializeFromRoute = async () => {
    playlistId.value = routePlaylistId.value;
    videoId.value = routeVideoId.value;

    await initialize();
  };

  const watchRoute = () => {
    if (isWatchingRoute) {
      return;
    }

    isWatchingRoute = true;

    watch(
      () => routePlaylistId.value,
      async () => {
        await initializeFromRoute();
      },
      { immediate: true },
    );

    watch(
      () => routeVideoId.value,
      async () => {
        videoId.value = routeVideoId.value;

        if (currentVideo.value) {
          return;
        }

        await initialize();
      },
    );
  };

  const loadMoreVideos = async () => {
    if (isLoadingMoreVideos || allVideosLoaded.value) {
      return;
    }

    isLoadingMoreVideos = true;

    try {
      await loadPlayQueueData();
    } finally {
      isLoadingMoreVideos = false;
    }
  };

  const playNextVideo = async () => {
    let currentIndex = mappedVideos.value.findIndex(
      (video) => video?.id === routeVideoId.value,
    );

    while (!videos.value[currentIndex + 1] && !allVideosLoaded.value) {
      try {
        await loadMoreVideos();
      } catch (error) {
        console.error("Error loading next play queue video:", error);
        return;
      }

      currentIndex = mappedVideos.value.findIndex(
        (video) => video?.id === routeVideoId.value,
      );
    }

    const nextVideo = videos.value[currentIndex + 1]?.video;
    if (!nextVideo) {
      return;
    }

    await router.replace({
      path: `/video/${nextVideo.id}`,
      query: playlistId.value ? { p: playlistId.value } : {},
    });
  };

  const playVideo = async (video: any) => {
    await router.push({
      path: `/video/${video.id}`,
      query: playlistId.value ? { p: playlistId.value } : {},
    });
  };

  const scrollPlayQueue = async ({ done }: any) => {
    if (allVideosLoaded.value) {
      done("empty");
      return;
    }

    try {
      await loadMoreVideos();
      done("ok");
    } catch (error) {
      console.error("Error loading more videos for play queue:", error);
      done("error");
    }
  };

  return {
    allVideosLoaded,
    videos,
    playlistId,
    videoId,
    loadingState,
    title,
    routeVideoId,
    routePlaylistId,
    mappedVideos,
    currentVideo,
    validCurrentVideo,
    captionsUrl,
    streamUrl,
    playVideo,
    playNextVideo,
    scrollPlayQueue,
    initialize,
    initializeFromRoute,
    watchRoute,
  };
};
