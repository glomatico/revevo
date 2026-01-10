<script lang="ts" setup>
import 'vidstack/bundle';

const props = defineProps<{
  streamUrl?: string;
  captionsUrl?: string;
  onEnd?: () => Promise<void>;
}>();

const {
  streamUrl,
  captionsUrl,
  videoPlayer,
  initializeWatcher,
} = useVideoPlayer();

onMounted(async () => {
  initializeWatcher();

  watch(() => [props.streamUrl, props.captionsUrl], async () => {
    streamUrl.value = props.streamUrl!;
    captionsUrl.value = props.captionsUrl!;
  }, { immediate: true });
});
</script>

<template>
  <media-player ref="videoPlayer" playsInline @ended="props.onEnd?.()">
    <media-provider></media-provider>
    <media-video-layout></media-video-layout>
  </media-player>
</template>

<style scoped>
media-player {
  max-height: 75vh;
  aspect-ratio: 16 / 9;
  background-color: black;
}

media-player :deep(video) {
  width: 100%;
  height: 100%;
}
</style>
