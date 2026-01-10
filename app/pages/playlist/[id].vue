<script lang="ts" setup>
const {
  mappedVideos,
  loadingState,
  playlist,
  validPlaylist,
  loadPlaylistVideosScroll,
  initializeFromRoute,
} = usePlaylist();

onMounted(async () => {
  await initializeFromRoute();
});
</script>

<template>

  <Head>
    <Title>
      {{ validPlaylist ? `${playlist.title} - ` : '' }}
      Revevo
    </Title>
  </Head>

  <v-container>
    <StatusContainer :loading-state="loadingState" :empty="!validPlaylist">
      <template #error-message>
        Failed to load playlist.
      </template>

      <template #empty-message>
        Playlist not found or is unavailable.
      </template>

      <v-row>
        <v-col cols="12" sm="5">
          <PlaylistInfo :playlist="playlist" />
        </v-col>

        <v-col cols="12" sm="7">
          <StatusContainer :empty="!mappedVideos?.length">
            <template #empty-message>
              No videos available in this playlist.
            </template>

            <v-infinite-scroll @load="loadPlaylistVideosScroll" class="overflow-x-hidden">
              <v-row>
                <v-col v-for="(video, index) in mappedVideos" :key="video" cols="12">
                  <div v-for="className in ['d-none d-sm-block', 'd-sm-none']" :class="className" :key="className">
                    <VideoThumbnail :video="video" :vertical="className === 'd-sm-none'" :playlist-id="playlist.id"
                      :index="index + 1">
                    </VideoThumbnail>
                  </div>
                </v-col>
              </v-row>
            </v-infinite-scroll>
          </StatusContainer>
        </v-col>
      </v-row>
    </StatusContainer>
  </v-container>
</template>
