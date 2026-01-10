<script lang="ts" setup>
import 'vidstack/bundle';

const props = defineProps<{
  videoPlayer: ReturnType<typeof useVideoPlayer>;
  onEnd?: () => void;
}>();

const {
  videoPlayerElement,
  initializeWatcher,
} = props.videoPlayer;

onMounted(async () => {
  initializeWatcher();
});
</script>

<template>
  <media-player ref="videoPlayerElement" playsInline @ended="props.onEnd?.()">
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
