<script lang="ts" setup>
const route = useRoute();

const {
  loadVideo,
  loadingState,
  videoId,
  video,
  validVideo,
  streamUrl,
  captionsUrl,
  filteredRelatedVideos,
} = useVideo();

onMounted(() => {
  videoId.value = route.params.id as string;
  loadVideo();
});
</script>


<template>

  <Head>
    <Title>{{ validVideo ? `${video?.basicMetaV3.title} - Revevo` : 'Revevo' }}</Title>
  </Head>

  <ClientOnly>
    <VideoPlayer :stream-url="streamUrl!" :captions-url="captionsUrl!" />
  </ClientOnly>

  <v-container>
    <v-row>
      <template v-if="loadingState === LoadingState.IDLE" />

      <v-col v-else-if="loadingState === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingState === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load video information.</v-alert>
      </v-col>


      <template v-else>
        <v-col cols="12" md="8">
          <v-alert v-if="!validVideo" type="warning">Video not found or is unavailable.</v-alert>
          <VideoInfo v-else :video="video!" />
        </v-col>

        <v-col cols="12" md="4">
          <v-row>
            <v-col cols="12">
              <p class="text-h5">
                Up next
              </p>
            </v-col>

            <v-col v-for="item in filteredRelatedVideos" :key="item.basicMetaV3.isrc" cols="12">
              <div class="d-none d-sm-block">
                <VideoThumbnail :video="item" />
              </div>
              <div class="d-sm-none">
                <VideoThumbnail :video="item" :vertical="true" />
              </div>
            </v-col>
          </v-row>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
