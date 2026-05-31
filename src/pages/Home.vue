<script setup lang="ts">
import AppStatusContainer from '@/components/AppStatusContainer.vue';
import PlaylistThumbnail from '@/components/PlaylistThumbnail.vue';
import VideoGrid from '@/components/VideoGrid.vue';
import { useHome } from '@/composables/useHome';
import { usePageTitle } from '@/composables/usePageTitle';
import { onMounted } from 'vue';

const {
  loadResultHome,
  sections,
  initialize,
} = useHome();

usePageTitle();

const getSectionVideos = (section: any) => {
  return (section.container?.items || [])
    .map((item: any) => item.video)
    .filter(Boolean);
};

onMounted(async () => {
  await initialize();
});
</script>

<template>
  <v-container>
    <AppStatusContainer :loading-state="loadResultHome.loadingState" :empty="!sections.length">
      <template #error>
        <v-alert type="error" variant="outlined">
          {{ $t('home.error') }}
        </v-alert>
      </template>

      <template #empty>
        <v-alert type="info" variant="outlined">
          {{ $t('home.empty') }}
        </v-alert>
      </template>

      <v-row>
        <v-col v-for="section in sections" :key="section.container?.title" cols="12" class="mb-8">
          <v-row>
            <v-col cols="12">
              <h1 class=" ma-0">
                {{ section.container?.title }}
              </h1>

              <v-divider thickness="2" />
            </v-col>

            <v-col v-if="section.container?.type === 'video'" cols="12">
              <VideoGrid :video-items="getSectionVideos(section)" :video-props="{ vertical: true }" />
            </v-col>

            <v-col v-else-if="section.container?.type === 'playlist'" cols="12">
              <v-slide-group show-arrows>
                <v-slide-group-item v-for="item in section.container.items" :key="item.container?.id">
                  <div class="home-playlist-item">
                    <PlaylistThumbnail :playlist="item.container" />
                  </div>
                </v-slide-group-item>
              </v-slide-group>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </AppStatusContainer>
  </v-container>
</template>

<style scoped>
.home-playlist-item {
  width: 300px;
  max-width: 72vw;
  padding-right: 16px;
}
</style>
