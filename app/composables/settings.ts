export const useSettings = () => {
  const defaultSettings: Settings = {
    playbackMethod: PlaybackMethod.HLS,
    enableCaptions: false,
    hidePseudoCountryIsrc: false,
  };
  const settings = ref<Settings>(defaultSettings);

  const loadSettings = () => {
    Object.keys(defaultSettings).forEach((key) => {
      const stored = localStorage.getItem(key);
      const defaultValue = (defaultSettings as any)[key];

      if (stored !== null) {
        if (typeof defaultValue === 'boolean') {
          (settings.value as any)[key] = stored === 'true';
        } else if (typeof defaultValue === 'number') {
          (settings.value as any)[key] = Number(stored);
        } else {
          (settings.value as any)[key] = stored;
        }
      }

      watch(
        () => (settings.value as any)[key],
        (newValue) => {
          localStorage.setItem(key, newValue.toString());
        }
      );
    });
  };

  return {
    loadSettings,
    settings,
  };
};
