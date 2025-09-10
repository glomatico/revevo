<template>
  <VideoPlayer :stream-url="streamUrl!" :captions-url="captionsUrl!" />

  <v-container>
    <v-row>
      <v-col v-if="loadingState === LoadingState.Loading" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingState === LoadingState.Error" cols="12">
        <v-alert type="error">Failed to load video information.</v-alert>
      </v-col>

      <v-col v-else-if="!isVideoValid(video)" cols="12">
        <v-alert type="warning">Video not found or is unavailable.</v-alert>
      </v-col>

      <template v-else>
        <v-col cols="12" md="8">
          <VideoInfo :video="video!" />
        </v-col>

        <v-col cols="12" md="4">
          <v-row>
            <v-col cols="12">
              <p class="text-h5">
                Up next
              </p>
            </v-col>

            <v-col v-for="item in filteredRelatedVideos" :key="item.basicMetaV3.isrc" cols="12">
              <VideoThumbnail :video="item" />
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const route = useRoute();
const { getVideos, isVideoValid } = useVideo();

const videoId = ref<string>(route.params.id as string);
const loadingState = ref<LoadingState>(LoadingState.Loading);
const video = ref<Video | null>(null);
const streamUrl = ref<string | null>(null);
const captionsUrl = ref<string | null>(null);
const filteredRelatedVideos = ref<Video[] | null>(null);

const loadVideo = async () => {
  try {
    const videos = (await getVideos(videoId.value))!.data;

    video.value = videos ? videos[0]! : null;
  } catch (error) {
    console.error(error);
    loadingState.value = LoadingState.Error;
  }

  loadingState.value = LoadingState.Loaded;

  filterRelatedVideos();
  streamUrl.value = video.value?.streamsV3!.find(s => s.format === 'hls')?.url || null;
  if (streamUrl.value) {
    streamUrl.value = streamUrl.value.replace('http://', 'https://');
  }
  captionsUrl.value = `/api/captions/${videoId.value}`;
};

const filterRelatedVideos = () => {
  if (!video.value?.relatedVideos?.data) return;
  filteredRelatedVideos.value = video.value.relatedVideos.data;
  filteredRelatedVideos.value = filteredRelatedVideos.value.filter(v => isVideoValid(v, false) && v.basicMetaV3.isrc !== video.value?.basicMetaV3.isrc);
};

onMounted(async () => {
  await loadVideo();
});

useHead(() => ({
  title: video.value ? `${video.value.basicMetaV3.title} - Revevo` : 'Revevo'
}));
</script>
