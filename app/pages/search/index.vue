<script lang="ts" setup>
const {
  settings,
  initialize: initializeSettings,
} = useSettings();

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
} = useSearch(settings.value);

onMounted(async () => {
  initializeSettings();
  initializeWatcher();
});
</script>

<template>
  <v-container>
    <StatusContainer :loading-state="loadingState">
      <template #error-message>
        Failed to load search results.
      </template>

      <v-row>
        <v-col v-if="query" cols="12">
          <p class="text-h4 font-weight-bold">
            Search results for "{{ query }}"
          </p>
        </v-col>

        <v-col cols="12">
          <AppTabs :tabs="['videos', 'artists', 'playlists']" route-param-key="t">
            <template #videos>
              <StatusContainer :empty="videos.length === 0">
                <template #empty-message>
                  No videos found.
                </template>

                <v-infinite-scroll @load="loadSearchVideoScroll" class="overflow-x-hidden">
                  <v-row>
                    <v-col v-for="video in videos" :key="video" cols="12" sm="6" md="4" lg="3">
                      <VideoThumbnail :video="video" vertical />
                    </v-col>
                  </v-row>
                </v-infinite-scroll>
              </StatusContainer>
            </template>

            <template #artists>
              <StatusContainer :empty="artists.length === 0">
                <template #empty-message>
                  No artists found.
                </template>

                <v-infinite-scroll @load="loadSearchArtistScroll" class="overflow-x-hidden">
                  <v-row>
                    <v-col v-for="item in artists" :key="item.id" cols="12" sm="6" md="4" lg="3">
                      <ArtistThumbnail :artist="item" />
                    </v-col>
                  </v-row>
                </v-infinite-scroll>
              </StatusContainer>
            </template>

            <template #playlists>
              <StatusContainer :empty="playlists.length === 0">
                <template #empty-message>
                  No playlists found.
                </template>

                <v-infinite-scroll @load="loadSearchPlaylistScroll" class="overflow-x-hidden">
                  <v-row>
                    <v-col v-for="item in playlists" :key="item.id" cols="12" sm="6" md="4" lg="3">
                      <PlaylistThumbnail :playlist="item" />
                    </v-col>
                  </v-row>
                </v-infinite-scroll>
              </StatusContainer>
            </template>
          </AppTabs>
        </v-col>
      </v-row>
    </StatusContainer>
  </v-container>
</template>
