<script lang="ts" setup>
const {
  loadingState,
  videoId,
  video,
  validVideo,
  videoPlayer,
  initializeWatcher,
} = useVideo();

const continuousPlay = ref();

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

  <ClientOnly>
    <VideoPlayer ref="videoPlayer" @ended="continuousPlay?.playNextVideo" />
  </ClientOnly>

  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <template v-if="loadingState === LoadingState.IDLE" />

        <LoadingSpinner v-else-if="loadingState === LoadingState.LOADING" />

        <v-alert v-else-if="loadingState === LoadingState.ERROR" type="error">
          Failed to load video.
        </v-alert>

        <v-alert v-else-if="!validVideo" type="warning">Video not found or is unavailable.</v-alert>

        <VideoInfo v-else :id="video.id" :title="video.title" :genre="video.genre" :duration="video.duration"
          :explicit="video.explicit" :lyric-video="video.lyricVideo" :date="video.created" :copyright="video.copyright"
          :label="video.label" :copyright-year="video.copyrightYear" :views="video.viewCounts?.total">
          <template #artists>
            <v-row dense class="my-2">
              <v-col v-for="artist in video.artists" :key="artist" cols="auto">
                <ArtistLinkChip :artist-id="artist.artist.id" :artist-name="artist.artist.name"
                  :artist-thumbnail="artist.artist.thumbnail" />
              </v-col>
            </v-row>
          </template>

          <template #streamurls>
            <VideoStreamUrls>
              <template #default>
                <VideoStreamsUrlRow label="HLS" :url="video.hls" />
                <VideoStreamsUrlRow v-for="mp4Item in video.mp4" :key="mp4Item.quality"
                  :label="`MP4 ${mp4Item.quality}`" :url="mp4Item.url" />
                <VideoStreamsUrlRow label="Captions (SRT)" :url="video.captions.srt.url" />
                <VideoStreamsUrlRow label="Captions (VTT)" :url="video.captions.vtt.url" />
                <VideoStreamsUrlRow label="Captions (TTML)" :url="video.captions.ttml.url" />
              </template>
            </VideoStreamUrls>
          </template>
        </VideoInfo>
      </v-col>

      <v-col v-if="videoId" cols="12" md="4">
        <ContinuousPlay ref="continuousPlay" :video-id="videoId" />
      </v-col>
    </v-row>
  </v-container>
</template>
