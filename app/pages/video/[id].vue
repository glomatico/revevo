<template>
  <div v-if="isLoadingGeneral">
    <LoadingSpinner />
  </div>
  <div v-else-if="!video">
    <v-container>
      <v-alert type="error">Failed to load video information.</v-alert>
    </v-container>
  </div>
  <div v-else>
    <VideoPlayer :stream-url="video.hls" :captions-url="`/api/captions/${videoId}`" />
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { getVideo } = useVideo();

const videoId = ref<string>(route.params.id as string);
const isLoadingGeneral = ref<boolean>(true);
const video = ref<Video | null>(null);

const loadVideo = async () => {
  isLoadingGeneral.value = true;
  try {
    video.value = await getVideo(videoId.value);
  } catch (error) {
    console.error('Error loading video:', error);
  } finally {
    isLoadingGeneral.value = false;
  }
};

onMounted(async () => {
  await loadVideo();
});
</script>
