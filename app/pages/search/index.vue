<script lang="ts" setup>
const {
  loadingState,
  query,
  videos,
  artists,
  playlists,
  loadSearchVideoScroll,
  loadSearchArtistScroll,
  loadSearchPlaylistScroll,
  initializeWatcher,
} = useSearch();

onMounted(async () => {
  initializeWatcher();
});
</script>

<template>
  <v-container>
    <v-row>
      <template v-if="loadingState === LoadingState.IDLE" />

      <v-col v-else-if="loadingState === LoadingState.LOADING" cols="12">
        <LoadingSpinner />
      </v-col>

      <v-col v-else-if="loadingState === LoadingState.ERROR" cols="12">
        <v-alert type="error">Failed to load search results.</v-alert>
      </v-col>

      <template v-else>
        <v-col>
          <p class="text-h4 font-weight-bold">
            Search results for "{{ query }}"
          </p>
        </v-col>

        <v-col cols="12">
          <AppTabs :tabs="['videos', 'artists', 'playlists']" route-param-key="t">
            <template #videos>
              <v-row v-if="videos.length === 0" cols="12">
                <v-col cols="12">
                  <v-alert type="info">No videos found.</v-alert>
                </v-col>
              </v-row>

              <v-infinite-scroll v-else @load="loadSearchVideoScroll">
                <v-row>
                  <v-col v-for="item in videos" :key="item" cols="12" sm="6" md="4" lg="3">
                    <VideoThumbnail :id="item.id" :title="item.title" :created="item.created"
                      :thumbnail-url="item.thumbnail" :explicit="item.explicit" :duration="item.duration"
                      :views="item.viewCounts?.total" vertical>
                      <template #artists>
                        <ArtistLink v-for="(artist, index) in item.artists" :key="artist.artist.id"
                          :artist-id="artist.artist.id" :artist-name="artist.artist.name"
                          :last="index === item.artists.length - 1" />
                      </template>
                    </VideoThumbnail>
                  </v-col>
                </v-row>
              </v-infinite-scroll>
            </template>

            <template #artists>
              <v-row v-if="artists.length === 0" cols="12">
                <v-col cols="12">
                  <v-alert type="info">No artists found.</v-alert>
                </v-col>
              </v-row>

              <v-infinite-scroll v-else @load="loadSearchArtistScroll">
                <v-row>
                  <v-col v-for="item in artists" :key="item" cols="12" sm="6" md="4" lg="3">
                    <ArtistThumbnail :artist-id="item.id" :artist-name="item.name"
                      :artist-avatar-url="item.thumbnail" />
                  </v-col>
                </v-row>
              </v-infinite-scroll>
            </template>

            <template #playlists>
              <v-row v-if="playlists.length === 0">
                <v-col cols="12">
                  <v-alert type="info">No playlists found.</v-alert>
                </v-col>
              </v-row>

              <v-infinite-scroll v-else @load="loadSearchPlaylistScroll">
                <v-row>
                  <v-col v-for="item in playlists" :key="item" cols="12" sm="6" md="4" lg="3">
                    <PlaylistThumbnail :id="item.id" :thumbnail-url="item.thumbnail" :title="item.title" />
                  </v-col>
                </v-row>
              </v-infinite-scroll>
            </template>
          </AppTabs>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
