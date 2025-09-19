<script lang="ts" setup>
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
  load,
  htmlVideo,
  streamUrl,
  captionsUrl,
} = useVideoPlayer();

onMounted(async () => {
  watch(
    () => props.load,
    async () => {
      load.value = props.load!;
      streamUrl.value = props.streamUrl!;
      captionsUrl.value = props.captionsUrl!;

      loadVideoPlayer();
    }, { immediate: true }
  );
});
</script>

<template>
  <video ref="htmlVideo" class="video-container" controls @ended="emit('ended')">
  </video>
</template>

<style scoped>
.video-container {
  width: 100%;
  max-height: 75vh;
  background-color: black;
  aspect-ratio: 16/9;
}
</style>
