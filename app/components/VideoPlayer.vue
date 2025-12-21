<script lang="ts" setup>
import 'vidstack/bundle';

const emit = defineEmits<{
  (e: 'ended'): void;
}>();

const {
  loadVideoPlayer,
  unloadVideoPlayer,
  videoPlayer,
} = useVideoPlayer();

defineExpose({
  loadVideoPlayer,
  unloadVideoPlayer,
});
</script>

<template>
  <media-player ref="videoPlayer" playsInline @ended="emit('ended')">
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
