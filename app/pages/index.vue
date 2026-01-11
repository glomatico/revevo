<script lang="ts" setup>
const {
  home,
  loadingState,
  initialize,
} = useHome();

onMounted(async () => {
  await initialize();
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
    <StatusContainer :loading-state="loadingState" :empty="!home?.items?.length">
      <template #error-message>
        Failed to load home page.
      </template>

      <template #empty-message>
        No content available.
      </template>

      <v-row>
        <v-col v-for="(section, index) in home?.items" :key="section" cols="12" class="mb-8">
          <v-row>
            <v-col cols="12">
              <p class="text-h4 font-weight-bold">{{ section.container.title }}</p>
            </v-col>

            <v-divider thickness="2" />

            <v-col v-if="section.container.type === 'video'" v-for="item in section.container.items" :key="item"
              cols="12" sm="6" md="4" lg="3">
              <VideoThumbnail :video="item.video" vertical />
            </v-col>

            <v-slide-group v-else-if="section.container.type === 'playlist'" cols="12">
              <v-col v-for="(playlist, index) in section.container.items" :key="playlist" cols="auto">
                <v-slide-group-item>
                  <PlaylistThumbnail :playlist="playlist.container" :index="index" :width="300" />
                </v-slide-group-item>
              </v-col>
            </v-slide-group>
          </v-row>
        </v-col>
      </v-row>
    </StatusContainer>
  </v-container>
</template>
