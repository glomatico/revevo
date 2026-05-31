import { ref, watch } from "vue";
import { DEFAULT_SETTINGS } from "./constants";

const settings = ref(DEFAULT_SETTINGS);

export const useSettings = () => {
  const loadSettings = () => {
    const stored = localStorage.getItem("app-settings");
    if (stored) {
      settings.value = {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(stored),
      };
    }
  };

  const initialize = () => {
    loadSettings();

    watch(
      settings,
      (val) => {
        localStorage.setItem("app-settings", JSON.stringify(val));
      },
      { deep: true },
    );
  };

  const resetSettings = () => {
    settings.value = { ...DEFAULT_SETTINGS };
  };

  return { settings, initialize, resetSettings };
};
