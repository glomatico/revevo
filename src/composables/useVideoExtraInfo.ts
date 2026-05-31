import { computed, ref } from "vue";
import { LoadingState } from "./enums";
import { useVevoApi } from "./useVevoApi";

export const useVideoExtraInfo = () => {
  const api = useVevoApi();

  const videoId = ref("");
  const extraInfo = ref<any>(null);
  const loadingState = ref(LoadingState.IDLE);

  const isExtraInfoValid = computed(() => Boolean(extraInfo.value));

  const loadExtraInfoData = async () => {
    if (!videoId.value) {
      return;
    }

    extraInfo.value = await api.getVideo(videoId.value);
  };

  const initialize = async (id: string) => {
    videoId.value = id;
    extraInfo.value = null;
    loadingState.value = LoadingState.LOADING;

    try {
      await loadExtraInfoData();
    } catch (error) {
      console.error("Error loading extra video info:", error);
      loadingState.value = LoadingState.ERROR;
      return;
    }

    loadingState.value = LoadingState.SUCCESS;
  };

  return {
    extraInfo,
    isExtraInfoValid,
    loadingState,
    videoId,
    initialize,
  };
};
