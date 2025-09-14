<script lang="ts" setup>
const props = defineProps<{
  captionsUrl?: string;
  streamUrl?: string;
}>();

const emit = defineEmits<{
  (e: 'ended'): void;
}>();

const {
  loadVideoPlayer,
  streamUrl,
  captionsUrl,
  htmlVideo
} = useVideoPlayer();

const onEnded = () => {
  emit('ended');
}

watch(props, async () => {
  streamUrl.value = props.streamUrl;
  captionsUrl.value = props.captionsUrl;

  await loadVideoPlayer();
})
</script>

<template>
  <video ref="htmlVideo" controls class="video-player" @ended="onEnded">
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
