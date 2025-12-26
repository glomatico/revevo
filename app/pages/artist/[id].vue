<script lang="ts" setup>
const route = useRoute();


const {
  loadingStateArtist,
  loadingStateVideos,
  artistId,
  artist,
  sortVideos,
  filteredVideos,
  validArtist,
  loadArtist,
  loadVideosScroll,
  loadAllVideos,
} = useArtist();

onMounted(async () => {
  artistId.value = route.params.id as string;
  await loadArtist();
});
</script>

<template>

  <Head>
    <Title>
      {{ validArtist ? `${artist.name} - ` : '' }}
      Revevo
    </Title>
  </Head>

  <v-container>
    <StatusContainer :loading-state="loadingStateArtist" :empty="!validArtist">
      <template #error-message>
        Failed to load artist information.
      </template>

      <template #empty-message>
        Artist not found.
      </template>

      <v-row>
        <v-col cols="12">
          <ArtistPageBanner :artist-avatar-url="artist.thumbnail" :artist-name="artist.name"
            :video-count="artist.videos.itemsCount" :view-count="artist.viewCounts.total" />
        </v-col>

        <v-col cols="12">
          <v-divider thickness="2" />
        </v-col>

        <v-col cols="12" align="center">
          <v-btn-toggle v-model="sortVideos" @update:model-value="loadAllVideos"
            :disabled="loadingStateVideos === LoadingState.LOADING">
            <v-btn v-for="option in ['views', 'date', 'a-z']" :key="option" class="text-none text-capitalize"
              :value="option" variant="outlined">
              {{ option }}
            </v-btn>
          </v-btn-toggle>
        </v-col>

        <v-col cols="12">
          <StatusContainer :loading-state="loadingStateVideos" :empty="filteredVideos.length === 0">
            <template #error-message>
              Failed to load videos.
            </template>

            <template #empty-message>
              No videos found for this artist.
            </template>

            <v-infinite-scroll @load="loadVideosScroll" class="overflow-x-hidden">
              <v-row class="mx-0">
                <v-col v-for="video in filteredVideos" :key="video" cols="12" sm="6" md="4" lg="3">
                  <VideoThumbnail :id="video.id" :title="video.title" :created="video.created"
                    :thumbnail-url="video.thumbnail" :explicit="video.explicit" :duration="video.duration"
                    :views="video.viewCounts.total" vertical>
                  </VideoThumbnail>
                </v-col>
              </v-row>
            </v-infinite-scroll>
          </StatusContainer>
        </v-col>
      </v-row>
    </StatusContainer>
  </v-container>
</template>
