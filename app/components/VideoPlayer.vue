<script lang="ts" setup>
const props = defineProps<{
  streamUrl?: string;
  captionsUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'ended'): void;
}>();

const {
  loadVideoPlayer,
  htmlVideo,
  streamUrl,
  captionsUrl,
} = useVideoPlayer();

onMounted(async () => {
  streamUrl.value = props.streamUrl;
  captionsUrl.value = props.captionsUrl;
  await loadVideoPlayer();
});
</script>

<template>
  <video ref="htmlVideo" controls class="video-player" @ended="emit('ended')">
  </video>
</template>

<style scoped>
.video-player {
  width: 100%;
  background-color: #000;
  aspect-ratio: 16 / 9;
  max-height: 75vh;
}
</style>
