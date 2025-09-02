<template>
  <v-container v-if="isLoadingVideo">
    <LoadingSpinner />
  </v-container>

  <v-container v-else-if="!video">
    <v-alert type="error">Failed to load video information.</v-alert>
  </v-container>

  <div v-else>
    <VideoPlayer :stream-url="video.hls!" :captions-url="`/api/captions/${videoId}`" />
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <VideoInfo :video="video" />
        </v-col>
        <v-col>
          <div v-if="isLoadingContinuousPlay">
            <LoadingSpinner />
          </div>
          <div v-else-if="!continuousPlay">
            <v-alert type="info">No related videos found.</v-alert>
          </div>
          <RelatedVideosSection v-else :continuous-play="continuousPlay" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const { getVideo, getContinuousPlay } = useVideo();

const videoId = ref<string>(route.params.id as string);
const isLoadingVideo = ref<boolean>(true);
const video = ref<Video | null>(null);
const continuousPlay = ref<ContinuousPlay | null>(null);
const isLoadingContinuousPlay = ref<boolean>(true);

const loadVideo = async () => {
  isLoadingVideo.value = true;
  try {
    video.value = await getVideo(videoId.value);
  } catch (error) {
    console.error('Error loading video:', error);
  } finally {
    isLoadingVideo.value = false;
  }
};

const loadContinuousPlay = async () => {
  try {
    continuousPlay.value = await getContinuousPlay(videoId.value);
    continuousPlay.value?.items.shift();
  } catch (error) {
    console.error('Error loading continuous play videos:', error);
  } finally {
    isLoadingContinuousPlay.value = false;
  }
};

onMounted(async () => {
  await loadVideo();
  await loadContinuousPlay();
});
</script>
