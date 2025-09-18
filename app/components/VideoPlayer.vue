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

const videoRef = ref();

onMounted(async () => {
  watch(
    () => props.streamUrl,
    async (newStreamUrl) => {
      streamUrl.value = newStreamUrl!;
      captionsUrl.value = props.captionsUrl!;

      loadVideoPlayer();
    }, { immediate: true }
  );
});
</script>

<template>
  <video ref="htmlVideo" class="video-container" controls>
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
