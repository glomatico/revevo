<script setup lang="ts">
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue';
import AppStatusContainer from '@/components/AppStatusContainer.vue';
import AppTabs from '@/components/AppTabs.vue';
import ArtistThumbnail from '@/components/ArtistThumbnail.vue';
import PlaylistThumbnail from '@/components/PlaylistThumbnail.vue';
import VideoGrid from '@/components/VideoGrid.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useSearch } from '@/composables/useSearch';
import { computed, onMounted, ref } from 'vue';

const {
  query,
  loadResultSearch,
  searchResults,
  createLoadSearchScroll,
  initializeWatcher,
} = useSearch();

const currentTab = ref("videos");
const loadSearchVideoScroll = createLoadSearchScroll("videos");
const loadSearchArtistScroll = createLoadSearchScroll("artists");
const loadSearchPlaylistScroll = createLoadSearchScroll("playlists");
const videoItems = computed(() => searchResults.value?.videos.items || []);

usePageTitle(computed(() =>
  query.value ? `Search results for "${query.value}"` : "Search",
));

onMounted(() => {
  initializeWatcher();
});
</script>

<template>
  <v-container>
    <AppStatusContainer :loading-state="loadResultSearch.loadingState">
      <template #error>
        <v-alert type="error" variant="outlined">
          Failed to load search results.
        </v-alert>
      </template>

      <v-row>
        <v-col v-if="query" cols="12">
          <h1 class="ma-0">
            Search results for "{{ query }}"
          </h1>
        </v-col>

        <v-col cols="12">
          <AppTabs v-model:current-tab="currentTab" :tabs="['videos', 'artists', 'playlists']" route-param-key="t">
            <template #videos>
              <AppInfiniteScroll :load="loadSearchVideoScroll">
                <v-col cols="12">
                  <VideoGrid :video-items="videoItems" :video-props="{ vertical: true }" />
                </v-col>
              </AppInfiniteScroll>
            </template>

            <template #artists>
              <AppStatusContainer :empty="searchResults!.artists.items.length === 0">
                <template #empty>
                  <v-alert type="info" variant="outlined">
                    No artists found.
                  </v-alert>
                </template>

                <AppInfiniteScroll :load="loadSearchArtistScroll">
                  <v-col v-for="artist in searchResults!.artists.items" :key="artist.id" cols="12" sm="6" md="4"
                    lg="3">
                    <ArtistThumbnail :artist="artist" />
                  </v-col>
                </AppInfiniteScroll>
              </AppStatusContainer>
            </template>

            <template #playlists>
              <AppStatusContainer :empty="searchResults!.playlists.items.length === 0">
                <template #empty>
                  <v-alert type="info" variant="outlined">
                    No playlists found.
                  </v-alert>
                </template>

                <AppInfiniteScroll :load="loadSearchPlaylistScroll">
                  <v-col v-for="playlist in searchResults!.playlists.items" :key="playlist.id" cols="12" sm="6" md="4"
                    lg="3">
                    <PlaylistThumbnail :playlist="playlist" />
                  </v-col>
                </AppInfiniteScroll>
              </AppStatusContainer>
            </template>
          </AppTabs>
        </v-col>
      </v-row>
    </AppStatusContainer>
  </v-container>
</template>
