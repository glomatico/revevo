import { computed, ref, watch } from "vue";
import { useSettings } from "./useSettings";
import { useVevoTvApi } from "./useVevoTvApi";
import { LoadingState } from "./enums";
import type { ItemsResult, SortOption } from "./types";
import { createLoadResult, isArtistValid } from "./utils";
import { DEFAULT_API_LIMIT } from "@/lib/vevoTv/constants";
import { useRoute } from "vue-router";

export const useArtist = () => {
  const route = useRoute();

  const api = useVevoTvApi();
  const { settings } = useSettings();

  let isWatchingRoute = false;
  let isLoadingMoreVideos = false;

  const artistId = ref("");
  const loadResultArtist = ref(createLoadResult());
  const loadResultVideos = ref(createLoadResult<ItemsResult>());
  const sortVideos = ref<SortOption>("original");

  const routeArtistId = computed(() => {
    const id = route.params.id;
    return typeof id === "string" ? id : "";
  });
  const validArtist = computed(() =>
    isArtistValid(loadResultArtist.value.result),
  );
  const sortedVideos = computed<any[]>(() => {
    const videos = loadResultVideos.value.result?.items || [];

    if (sortVideos.value === "views") {
      return videos
        .slice()
        .sort(
          (a, b) => (b?.viewCounts?.total || 0) - (a?.viewCounts?.total || 0),
        );
    }

    if (sortVideos.value === "date") {
      return videos
        .slice()
        .sort(
          (a, b) =>
            new Date(b?.created || 0).getTime() -
            new Date(a?.created || 0).getTime(),
        );
    }

    if (sortVideos.value === "a-z") {
      return videos.slice().sort((a, b) => {
        const titleA = a?.title?.toLowerCase() || "";
        const titleB = b?.title?.toLowerCase() || "";
        return titleA.localeCompare(titleB);
      });
    }

    return videos;
  });

  const loadArtist = async () => {
    if (!artistId.value) {
      return;
    }

    const response = await api.getArtist(
      artistId.value,
      0,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );
    loadResultArtist.value.result = response?.data?.artist;
    const pageVideos = response?.data?.artist?.videos?.items || [];
    const itemsCount = response?.data?.artist?.videos?.itemsCount || 0;

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
      !artistId.value ||
      !loadResultVideos.value.result ||
      loadResultVideos.value.result.isAllLoaded
    ) {
      return;
    }

    isLoadingMoreVideos = true;

    try {
      const response = await api.getArtistVideos(
        artistId.value,
        loadResultVideos.value.result.items.length,
        DEFAULT_API_LIMIT,
        !settings.value.hideExplicit,
      );

      const pageVideos = response?.data?.artist?.videos?.items || [];
      loadResultVideos.value.result.items.push(...pageVideos);
      loadResultVideos.value.result.isAllLoaded =
        loadResultVideos.value.result.items.length >=
          response?.data?.artist?.videos?.itemsCount ||
        pageVideos.length < DEFAULT_API_LIMIT;
    } finally {
      isLoadingMoreVideos = false;
    }
  };

  const loadAllVideos = async () => {
    loadResultVideos.value.loadingState = LoadingState.LOADING;

    try {
      while (loadResultVideos.value.result?.isAllLoaded === false) {
        await loadMoreVideos();
      }
    } catch (error) {
      console.error("Error loading all artist videos:", error);
      loadResultVideos.value.loadingState = LoadingState.ERROR;
      loadResultVideos.value.errorMessage =
        error instanceof Error ? error.message : String(error);
      return;
    }

    loadResultVideos.value.loadingState = LoadingState.SUCCESS;
  };

  const loadVideosScroll = async ({ done }: any) => {
    if (loadResultVideos.value.result?.isAllLoaded) {
      done("empty");
      return;
    }

    try {
      await loadMoreVideos();
      done("ok");
    } catch (error) {
      console.error("Error loading artist videos:", error);
      done("error");
    }
  };

  const initializeFromRoute = async () => {
    artistId.value = routeArtistId.value;

    loadResultArtist.value.loadingState = LoadingState.LOADING;

    try {
      await loadArtist();
    } catch (error) {
      console.error("Error loading artist:", error);
      loadResultArtist.value.loadingState = LoadingState.ERROR;
      loadResultArtist.value.errorMessage =
        error instanceof Error ? error.message : String(error);
      return;
    }

    loadResultArtist.value.loadingState = LoadingState.SUCCESS;
    loadResultVideos.value.loadingState = LoadingState.SUCCESS;
  };

  const watchRoute = () => {
    if (isWatchingRoute) {
      return;
    }

    isWatchingRoute = true;

    watch(
      () => routeArtistId.value,
      async () => {
        await initializeFromRoute();
      },
      { immediate: true },
    );
  };

  return {
    artistId,
    loadResultArtist,
    loadResultVideos,
    sortVideos,
    validArtist,
    sortedVideos,
    loadAllVideos,
    loadVideosScroll,
    initializeFromRoute,
    watchRoute,
  };
};
