import { DEFAULT_API_LIMIT } from "@/lib/vevoTv/constants";
import { computed, ref } from "vue";
import { LoadingState } from "./enums";
import { useSettings } from "./useSettings";
import { useVevoTvApi } from "./useVevoTvApi";
import { createLoadResult } from "./utils";

export const useHome = () => {
  const api = useVevoTvApi();
  const { settings } = useSettings();

  const loadResultHome = ref(createLoadResult<any>());

  const home = computed(() => loadResultHome.value.result);
  const sections = computed(() => home.value?.items || []);

  const loadHomeData = async () => {
    const response = await api.getHome(
      DEFAULT_API_LIMIT,
      !settings.value.hideExplicit,
    );

    loadResultHome.value.result = response?.data?.home || null;
  };

  const initialize = async () => {
    loadResultHome.value = createLoadResult();
    loadResultHome.value.loadingState = LoadingState.LOADING;

    try {
      await loadHomeData();
    } catch (error) {
      console.error("Error loading homepage:", error);
      loadResultHome.value.loadingState = LoadingState.ERROR;
      loadResultHome.value.errorMessage =
        error instanceof Error ? error.message : String(error);
      return;
    }

    loadResultHome.value.loadingState = LoadingState.SUCCESS;
  };

  return {
    home,
    loadResultHome,
    sections,
    initialize,
  };
};
