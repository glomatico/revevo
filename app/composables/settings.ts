
export const useSettings = () => {
  const settings = ref<Record<string, unknown>>(DEFAULT_SETTINGS);

  const loadSettings = () => {
    try {
      Object.keys(DEFAULT_SETTINGS).forEach((key) => {
        const stored = localStorage.getItem(key);
        if (stored !== null) {
          const defaultValue = (DEFAULT_SETTINGS as any)[key];
          if (typeof defaultValue === 'boolean') {
            (settings.value as any)[key] = stored === 'true';
          } else if (typeof defaultValue === 'number') {
            (settings.value as any)[key] = Number(stored);
          } else {
            (settings.value as any)[key] = stored;
          }
        }
      });
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  };

  const initializeWatchers = () => {
    Object.keys(DEFAULT_SETTINGS).forEach((key) => {
      watch(
        () => (settings.value as any)[key],
        (newValue) => {
          try {
            localStorage.setItem(key, newValue.toString());
          } catch (error) {
            console.error(`Failed to save setting ${key}:`, error);
          }
        }
      );
    });
  };

  return {
    settings,
    loadSettings,
    initializeWatchers,
  };
};
