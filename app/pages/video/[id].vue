<template>
  <v-container v-if="isLoadingVideo">
    <v-row>
      <v-col>
        <LoadingSpinner />
      </v-col>
    </v-row>
  </v-container>

  <v-container v-else-if="!video">
    <v-row>
      <v-col>
        <v-alert type="error">Failed to load video information.</v-alert>
      </v-col>
    </v-row>
  </v-container>

  <template v-else>
    <VideoPlayer :stream-url="streamUrl!" :captions-url="`/api/captions/${videoId}`" />

    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <VideoInfo :video="video" />
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
      </v-row>
    </v-container>
  </template>
</template>

<script lang="ts" setup>
const route = useRoute();
const { getVideos } = useVideo();

const videoId = ref<string>(route.params.id as string);
const isLoadingVideo = ref<boolean>(true);
const video = ref<Video | null>(null);
const streamUrl = ref<string | null>(null);
const filteredRelatedVideos = ref<Video[] | null>(null);

const loadVideo = async () => {
  isLoadingVideo.value = true;
  try {
    const videos = (await getVideos(videoId.value))!.data;
    video.value = videos ? videos[0]! : null;
  } catch (error) {
    console.error('Error loading video:', error);
  } finally {
    isLoadingVideo.value = false;
  }

  filterRelatedVideos();
  streamUrl.value = video.value?.streamsV3!.find(s => s.format === 'hls')?.url || null;
  if (streamUrl.value) {
    streamUrl.value = streamUrl.value.replace('http://', 'https://');
  }
};

const filterRelatedVideos = () => {
  if (!video.value?.relatedVideos?.data) return;
  filteredRelatedVideos.value = video.value.relatedVideos.data;
  filteredRelatedVideos.value = filteredRelatedVideos.value.filter(v => v.basicMetaV3 && v.basicMetaV3.isrc !== video.value?.basicMetaV3.isrc);
};

onMounted(async () => {
  await loadVideo();
});

useHead(() => ({
  title: video.value ? `${video.value.basicMetaV3.title} - Revevo` : 'Revevo'
}));
</script>
