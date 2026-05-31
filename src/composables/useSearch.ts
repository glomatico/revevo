import { DEFAULT_API_LIMIT } from "@/lib/vevoTv/constants";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { LoadingState } from "./enums";
import type { ItemsResult, SearchResults } from "./types";
import { useSettings } from "./useSettings";
import { useVevoTvApi } from "./useVevoTvApi";
import { createLoadResult } from "./utils";

export type SearchResultType = keyof SearchResults;

const getInitialItemsResult = (): ItemsResult => ({
  items: [],
  isAllLoaded: false,
});

const getInitialSearchResults = (): SearchResults => ({
  videos: getInitialItemsResult(),
  artists: getInitialItemsResult(),
  playlists: getInitialItemsResult(),
});

const responseKeys: Record<SearchResultType, string> = {
  videos: "videoSearch",
  artists: "artistSearch",
  playlists: "playlistSearch",
};

export const useSearch = () => {
  const route = useRoute();
  const vevoTvApi = useVevoTvApi();
  const { settings } = useSettings();

  let isWatchingRoute = false;
  let isLoadingMore = false;

  const query = ref("");
  const loadResultSearch = ref(
    createLoadResult<SearchResults>(getInitialSearchResults()),
  );

  const routeQuery = computed(() => {
    const paramQuery = route.params.query;
    if (typeof paramQuery === "string") {
      return paramQuery;
    }

    const queryParam = route.query.q;
    return typeof queryParam === "string" ? queryParam : "";
  });
  const searchResults = computed(() => loadResultSearch.value.result);

  const loadSearchData = async () => {
    if (!query.value || loadResultSearch.value.result === null) {
      return;
    }

    const results = loadResultSearch.value.result;
    const response = await vevoTvApi.search(
      query.value,
      results.videos.items.length,
      DEFAULT_API_LIMIT,
      results.artists.items.length,
      DEFAULT_API_LIMIT,
      results.playlists.items.length,
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );

    for (const key of Object.keys(responseKeys) as SearchResultType[]) {
      const responseKey = responseKeys[key];
      const result = results[key];
      const items = response?.data?.[responseKey]?.items || [];
      const itemsCount = response?.data?.[responseKey]?.itemsCount || 0;

      result.items.push(...items);
      result.isAllLoaded =
        result.items.length >= itemsCount || items.length < DEFAULT_API_LIMIT;
    }
  };

  const loadMoreSearchResults = async (type: SearchResultType) => {
    if (
      isLoadingMore ||
      !loadResultSearch.value.result ||
      loadResultSearch.value.result[type].isAllLoaded
    ) {
      return;
    }

    isLoadingMore = true;

    try {
      await loadSearchData();
    } finally {
      isLoadingMore = false;
    }
  };

  const createLoadSearchScroll = (type: SearchResultType) => {
    return async ({ done }: any) => {
      if (loadResultSearch.value.result?.[type].isAllLoaded) {
        done("empty");
        return;
      }

      try {
        await loadMoreSearchResults(type);
        done("ok");
      } catch (error) {
        console.error(`Error loading search ${type}:`, error);
        done("error");
      }
    };
  };

  const initialize = async () => {
    query.value = routeQuery.value.trim();
    loadResultSearch.value = createLoadResult<SearchResults>(
      getInitialSearchResults(),
    );

    if (!query.value) {
      return;
    }

    loadResultSearch.value.loadingState = LoadingState.LOADING;

    try {
      await loadSearchData();
    } catch (error) {
      console.error("Error loading search data:", error);
      loadResultSearch.value.loadingState = LoadingState.ERROR;
      loadResultSearch.value.errorMessage =
        error instanceof Error ? error.message : String(error);
      return;
    }

    loadResultSearch.value.loadingState = LoadingState.SUCCESS;
  };

  const initializeWatcher = () => {
    if (isWatchingRoute) {
      return;
    }

    isWatchingRoute = true;

    watch(
      () => routeQuery.value,
      async () => {
        await initialize();
      },
      { immediate: true },
    );
  };

  return {
    query,
    loadResultSearch,
    searchResults,
    createLoadSearchScroll,
    initialize,
    initializeWatcher,
  };
};
