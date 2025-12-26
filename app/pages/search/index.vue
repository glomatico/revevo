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
              </StatusContainer>
            </template>

            <template #artists>
              <StatusContainer :empty="artists.length === 0">
                <template #empty-message>
                  No artists found.
                </template>

                <v-infinite-scroll @load="loadSearchArtistScroll" class="overflow-x-hidden">
                  <v-row>
                    <v-col v-for="item in artists" :key="item" cols="12" sm="6" md="4" lg="3">
                      <ArtistThumbnail :artist-id="item.id" :artist-name="item.name"
                        :artist-avatar-url="item.thumbnail" />
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
                    <v-col v-for="item in playlists" :key="item" cols="12" sm="6" md="4" lg="3">
                      <PlaylistThumbnail :id="item.id" :thumbnail-url="item.thumbnail" :title="item.title" />
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
