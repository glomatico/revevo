<script lang="ts" setup>
const {
  settings,
  initialize: initializeSettings,
} = useSettings();

const {
  loadingState,
  video,
  validVideo,
  streamUrl,
  captionsUrl,
  initializeWatcher,
} = useVideo(settings.value);

const videoPlayer = useVideoPlayer(settings.value);

const playQueue = usePlayQueue(settings.value);

onMounted(async () => {
  initializeSettings();
  initializeWatcher();

  watch(
    () => [streamUrl.value, captionsUrl.value],
    async () => {
      videoPlayer.streamUrl.value = streamUrl.value;
      videoPlayer.captionsUrl.value = captionsUrl.value;
    },
    { immediate: true }
  );
});
</script>

<template>

  <Head>
    <Title>
      {{ validVideo ? `${video.title} - ` : '' }}
      Revevo
    </Title>
  </Head>

  <ClientOnly>
    <VideoPlayer :video-player="videoPlayer" :on-end="playQueue.playNextVideo" />
  </ClientOnly>

  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <StatusContainer :loading-state="loadingState" :empty="!validVideo">
          <template #error-message>
            Failed to load video.
          </template>

          <template #empty-message>
            Video not found or is unavailable.
          </template>

          <VideoInfo :video="video" />
        </StatusContainer>
      </v-col>

      <v-col cols="12" md="4">
        <PlayQueue :play-queue="playQueue" />
      </v-col>
    </v-row>
  </v-container>
</template>
