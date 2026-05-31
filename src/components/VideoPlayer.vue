<script setup lang="ts">
import 'vidstack/bundle';
import { useVideoPlayer } from '@/composables/useVideoPlayer';
import { computed, onMounted } from 'vue';

const props = defineProps<{
  src: string;
  captionsUrl?: string;
  onEnd?: () => void | Promise<void>;
}>();

const {
  applyCaptionSetting,
  initializeWatch,
  playerElement,
  rememberCaptionSetting,
  settings,
} = useVideoPlayer({
  captionsUrl: computed(() => props.captionsUrl),
  src: computed(() => props.src),
});

onMounted(() => {
  initializeWatch();
});
</script>

<template>
  <media-player ref="playerElement" :autoplay="!settings.disableAutoplay" playsinline crossorigin @ended="onEnd?.()"
    @text-tracks-change="applyCaptionSetting" @text-track-change="rememberCaptionSetting">
    <media-provider />

    <media-video-layout />
  </media-player>
</template>

<style scoped>
media-player {
  width: 100%;
  max-height: 75vh;
  aspect-ratio: 16 / 9;
  background: black;
}

media-player :deep(video) {
  width: 100%;
  height: 100%;
}
</style>
