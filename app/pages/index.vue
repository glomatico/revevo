<script lang="ts" setup>
const {
  loadHomePage,
  loadingState,
  topVideosSection,
  trendingArtistsSection,
  playlistsSection,
  filteredTopVideosSectionItems,
  filteredTrendingArtistsSectionItems,
  filteredPlaylistsSectionItems,
} = useHomePage();

onMounted(async () => {
  await loadHomePage();
});

useSeoMeta({
  title: 'Revevo',
  ogTitle: 'Revevo',
  description: 'A music video streaming website that revives the old Vevo experience.',
  ogDescription: 'A music video streaming website that revives the old Vevo experience.',
  ogImage: 'https://img.vevo.com/images/defaultbackstageassets/vevo.png?width=720&height=720',
  twitterCard: 'summary_large_image',
})
</script>


<template>

  <v-container>
    <v-row>
      <template v-if="loadingState === LoadingState.IDLE" />

      <v-col v-if="loadingState === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>
      <v-col v-else-if="loadingState === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load homepage data.</v-alert>
      </v-col>
      <template v-else>
        <v-col cols="12">
          <p class="text-h4">
            {{ topVideosSection?.title }}
          </p>
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <v-row>
            <v-col v-for="(video, index) in filteredTopVideosSectionItems" :key="index" cols="12" sm="6" md="4" lg="3">
              <VideoThumbnail v-if="video" :video="video" :vertical="true" />
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <p class="text-h4">
            {{ trendingArtistsSection?.title }}
          </p>
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <v-slide-group>
            <v-slide-group-item v-for="(artist, index) in filteredTrendingArtistsSectionItems" :key="index">
              <div class="ma-2">
                <ArtistThumbnail :artist="artist.basicMeta" />
              </div>
            </v-slide-group-item>
          </v-slide-group>
        </v-col>

        <v-col cols="12">
          <p class="text-h4">
            {{ playlistsSection?.title }}
          </p>
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <v-slide-group>
            <v-slide-group-item v-for="(playlist, index) in filteredPlaylistsSectionItems" :key="index">
              <div class="ma-2">
                <PlaylistThumbnail :playlist="playlist" :id="playlist.id!" />
              </div>
            </v-slide-group-item>
          </v-slide-group>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
