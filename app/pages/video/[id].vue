<script lang="ts" setup>
definePageMeta({
  layout: 'video',
});

const {
  settings,
} = useSettings();

const videoPlayer = useVideoPlayer(settings.value);

const {
  loadingState,
  video,
  validVideo,
  initializeWatcher,
} = useVideo(settings.value, videoPlayer);

const playQueue = inject<ReturnType<typeof usePlayQueue>>('playQueue')!;

onMounted(async () => {
  initializeWatcher();
});
</script>

<template>

  <Head>
    <Title>
      {{ validVideo ? `${video.title} - ` : '' }}
      Revevo
    </Title>
  </Head>

  <v-row>
    <v-col cols="12">
      <ClientOnly>
        <VideoPlayer :video-player="videoPlayer" :on-end="playQueue.playNextVideo" />
      </ClientOnly>
    </v-col>

    <v-col cols="12">
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
  </v-row>
</template>
