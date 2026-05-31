<script setup lang="ts">
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue';
import AppStatusContainer from '@/components/AppStatusContainer.vue';
import PlaylistInfo from '@/components/PlaylistInfo.vue';
import VideoGrid from '@/components/VideoGrid.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { usePlaylist } from '@/composables/usePlaylist';
import { computed, onMounted } from 'vue';

const {
  playlistId,
  loadResultPlaylist,
  loadResultVideos,
  validPlaylist,
  mappedVideos,
  loadPlaylistVideosScroll,
  watchRoute,
} = usePlaylist();

const videoProps = () => ({
  playlistId: playlistId.value,
});

usePageTitle(computed(() =>
  validPlaylist.value ? loadResultPlaylist.value.result?.title : "",
));

onMounted(() => {
  watchRoute();
});
</script>

<template>
  <v-container>
    <AppStatusContainer :loading-state="loadResultPlaylist.loadingState" :empty="!validPlaylist">
      <template #error>
        <v-alert type="error" variant="outlined">
          {{ $t('playlist.error') }}
        </v-alert>
      </template>

      <template #empty>
        <v-alert type="info" variant="outlined">
          {{ $t('playlist.notFound') }}
        </v-alert>
      </template>

      <v-row>
        <v-col cols="12" sm="5">
          <PlaylistInfo v-if="loadResultPlaylist.result" :playlist="loadResultPlaylist.result" />
        </v-col>

        <v-col cols="12" sm="7">
          <AppStatusContainer :loading-state="loadResultVideos.loadingState" :empty="!mappedVideos.length">
            <template #error>
              <v-alert type="error" variant="outlined">
                {{ $t('playlist.videosError') }}
              </v-alert>
            </template>

            <template #empty>
              <v-alert type="info" variant="outlined">
                {{ $t('playlist.noVideos') }}
              </v-alert>
            </template>

            <AppInfiniteScroll :load="loadPlaylistVideosScroll">
              <v-col cols="12">
                <VideoGrid :video-items="mappedVideos" :video-props="videoProps" single-column />
              </v-col>
            </AppInfiniteScroll>
          </AppStatusContainer>
        </v-col>
      </v-row>
    </AppStatusContainer>
  </v-container>
</template>
