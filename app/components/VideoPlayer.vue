<template>
  <video ref="videoHtml" controls class="video-player">
  </video>
</template>

<script lang="ts" setup>
const props = defineProps<{
  streamUrl?: string;
  captionsUrl?: string;
}>();

const { attachHlsVideo, attachCaptions } = useVideo();

const videoHtml = ref<HTMLVideoElement>();

const loadVideo = async () => {
  try {
    attachHlsVideo(videoHtml.value!, props.streamUrl);
  } catch (error) {
    console.error(error);
  }
  await loadCaptions();
};

const loadCaptions = async () => {
  try {
    await attachCaptions(videoHtml.value!, props.captionsUrl);
  } catch (error) {
    console.error(error);
  }
};

watch(props, async () => {
  await loadVideo();
});

</script>

<style scoped>
.video-player {
  width: 100%;
  background-color: #000;
  aspect-ratio: 16 / 9;
  max-height: 75vh;
}
</style>
