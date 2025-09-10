<template>
  <video ref="videoHtml" controls class="video-player">
  </video>
</template>

<script lang="ts" setup>
const props = defineProps<{
  streamUrl: string;
  captionsUrl: string;
}>();

const { attachVideo, attachCaptions } = useVideo();

const videoHtml = ref<HTMLVideoElement>();

const loadVideo = async () => {
  try {
    attachVideo(videoHtml.value!, props.streamUrl);
  } catch (error) {
    console.error(error);
  }
  if (props.captionsUrl) {
    await loadCaptions();
  }
};

const loadCaptions = async () => {
  try {
    await attachCaptions(videoHtml.value!, props.captionsUrl);
  } catch (error) {
    console.error(error);
  }
};

onMounted(async () => {
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
