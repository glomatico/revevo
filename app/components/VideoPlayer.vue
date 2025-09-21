<script lang="ts" setup>
import 'vidstack/bundle';

const props = defineProps<{
  streamUrl?: string;
  captionsUrl?: string;
  load?: boolean;
}>();

const emit = defineEmits<{
  (e: 'ended'): void;
}>();

const {
  loadVideoPlayer,
  unloadVideoPlayer,
  videoPlayer,
  streamUrl,
  captionsUrl,
} = useVideoPlayer();

onMounted(async () => {
  watch(
    () => props.load,
    async () => {
      if (!props.load) {
        await unloadVideoPlayer();
        return;
      }
      streamUrl.value = props.streamUrl!;
      captionsUrl.value = props.captionsUrl!;
      loadVideoPlayer();
    }, { immediate: true }
  );
});
</script>

<template>
  <media-player ref="videoPlayer" @ended="emit('ended')">
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
