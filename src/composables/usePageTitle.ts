import {
  toValue,
  watchEffect,
  type MaybeRefOrGetter,
} from "vue";

const APP_TITLE = "Revevo";

export const formatPageTitle = (title?: string | null) => {
  const trimmedTitle = title?.trim();
  return trimmedTitle ? `${trimmedTitle} - ${APP_TITLE}` : APP_TITLE;
};

export const usePageTitle = (
  title?: MaybeRefOrGetter<string | null | undefined>,
) => {
  watchEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.title = formatPageTitle(toValue(title));
  });
};
