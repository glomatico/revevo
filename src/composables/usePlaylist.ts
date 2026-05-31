import { DEFAULT_API_LIMIT } from "@/lib/vevoTv/constants";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { LoadingState } from "./enums";
import type { ItemsResult } from "./types";
import { useSettings } from "./useSettings";
import { useVevoTvApi } from "./useVevoTvApi";
import { createLoadResult, isPlaylistValid } from "./utils";

export const usePlaylist = () => {
  const route = useRoute();
  const api = useVevoTvApi();
  const { settings } = useSettings();

  let isWatchingRoute = false;
  let isLoadingMoreVideos = false;

  const playlistId = ref("");
  const loadResultPlaylist = ref(createLoadResult<any>());
  const loadResultVideos = ref(createLoadResult<ItemsResult>());

  const routePlaylistId = computed(() => {
    const id = route.params.id;
    return typeof id === "string" ? id : "";
  });
  const validPlaylist = computed(() =>
    isPlaylistValid(loadResultPlaylist.value.result),
  );
  const mappedVideos = computed(() =>
    (loadResultVideos.value.result?.items || []).map((item) => item.video),
  );

  const loadPlaylist = async () => {
    if (!playlistId.value) {
      return;
    }

    const response = await api.getContainer(
      playlistId.value,
      0,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );
    const playlist = response?.data?.container;
    const pageVideos = playlist?.items || [];
    const itemsCount = playlist?.itemsCount || 0;

    loadResultPlaylist.value.result = playlist || null;
    loadResultVideos.value.result = {
      items: pageVideos,
      isAllLoaded:
        pageVideos.length >= itemsCount ||
        pageVideos.length < DEFAULT_API_LIMIT,
    };
  };

  const loadMoreVideos = async () => {
    if (
      isLoadingMoreVideos ||
      !playlistId.value ||
      !loadResultVideos.value.result ||
      loadResultVideos.value.result.isAllLoaded
    ) {
      return;
    }

    isLoadingMoreVideos = true;

    try {
      const response = await api.getContainerVideos(
        playlistId.value,
        loadResultVideos.value.result.items.length,
        DEFAULT_API_LIMIT,
        !settings.value.hideExplicit,
      );
      const playlist = response?.data?.container;
      const pageVideos = playlist?.items || [];
      const itemsCount = playlist?.itemsCount || 0;

      loadResultVideos.value.result.items.push(...pageVideos);
      loadResultVideos.value.result.isAllLoaded =
        loadResultVideos.value.result.items.length >= itemsCount ||
        pageVideos.length < DEFAULT_API_LIMIT;
    } finally {
      isLoadingMoreVideos = false;
    }
  };

  const loadPlaylistVideosScroll = async ({ done }: any) => {
    if (loadResultVideos.value.result?.isAllLoaded) {
      done("empty");
      return;
    }

    try {
      await loadMoreVideos();
      done("ok");
    } catch (error) {
      console.error("Error loading playlist videos:", error);
      done("error");
    }
  };

  const initializeFromRoute = async () => {
    playlistId.value = routePlaylistId.value;
    loadResultPlaylist.value = createLoadResult();
    loadResultVideos.value = createLoadResult();
    loadResultPlaylist.value.loadingState = LoadingState.LOADING;

    try {
      await loadPlaylist();
    } catch (error) {
      console.error("Error loading playlist:", error);
      loadResultPlaylist.value.loadingState = LoadingState.ERROR;
      loadResultPlaylist.value.errorMessage =
        error instanceof Error ? error.message : String(error);
      return;
    }

    loadResultPlaylist.value.loadingState = LoadingState.SUCCESS;
    loadResultVideos.value.loadingState = LoadingState.SUCCESS;
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
  };

  return {
    playlistId,
    loadResultPlaylist,
    loadResultVideos,
    validPlaylist,
    mappedVideos,
    routePlaylistId,
    loadPlaylist,
    loadMoreVideos,
    loadPlaylistVideosScroll,
    initializeFromRoute,
    watchRoute,
  };
};
