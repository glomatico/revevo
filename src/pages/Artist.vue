<script setup lang="ts">
import AppInfiniteScroll from '@/components/AppInfiniteScroll.vue';
import AppStatusContainer from '@/components/AppStatusContainer.vue';
import ArtistBanner from '@/components/ArtistBanner.vue';
import SortVideos from '@/components/SortVideos.vue';
import VideoGrid from '@/components/VideoGrid.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useArtist } from '@/composables/useArtist';
import { computed, onMounted } from 'vue';

const {
  loadResultArtist,
  loadResultVideos,
  sortVideos,
  sortedVideos,
  validArtist,
  loadAllVideos,
  loadVideosScroll,
  watchRoute,
} = useArtist();

usePageTitle(computed(() =>
  validArtist.value ? (loadResultArtist.value.result as any)?.name : "",
));

onMounted(async () => {
  await watchRoute();
});
</script>

<template>
  <v-container>
    <AppStatusContainer :loading-state="loadResultArtist.loadingState" :empty="!validArtist">
      <template #error>
        <v-alert type="error" variant="outlined">
          {{ $t('artist.error') }}
        </v-alert>
      </template>

      <template #empty>
        <v-alert type="info" variant="outlined">
          {{ $t('artist.notFound') }}
        </v-alert>
      </template>

      <v-row>
        <v-col cols="12">
          <ArtistBanner v-if="loadResultArtist.result" :artist="loadResultArtist.result" />
        </v-col>

        <v-divider thickness="2" />

        <v-col cols="12">
          <AppStatusContainer :loading-state="loadResultVideos.loadingState">
            <template #error>
              <v-alert type="error" variant="outlined">
                {{ $t('artist.videosError') }}
              </v-alert>
            </template>

            <v-row dense>
              <v-col cols="12">
                <SortVideos v-model:selected="sortVideos" @update:selected="loadAllVideos" />
              </v-col>

              <v-col cols="12">
                <AppInfiniteScroll :load="loadVideosScroll">
                  <v-col cols="12">
                    <VideoGrid :video-items="sortedVideos" :video-props="{ vertical: true }" />
                  </v-col>
                </AppInfiniteScroll>
              </v-col>
            </v-row>
          </AppStatusContainer>
        </v-col>
      </v-row>
    </AppStatusContainer>
  </v-container>
</template>
