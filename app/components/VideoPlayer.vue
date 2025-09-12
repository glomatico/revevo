<script lang="ts" setup>
const props = defineProps<{
  captionsUrl?: string;
  streamUrl?: string;
}>();

const { loadSettings, settings } = useSettings();

const {
  loadVideoPlayer,
  streamUrl,
  captionsUrl,
  htmlVideo
} = useVideoPlayer(settings.value);

watch(props, async () => {
  if (!props.streamUrl) {
    return;
  }

  streamUrl.value = props.streamUrl;
  captionsUrl.value = props.captionsUrl;

  await loadVideoPlayer();
})

onMounted(async () => {
  loadSettings();
});
</script>

<template>
  <video ref="htmlVideo" controls class="video-player">
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
