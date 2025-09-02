<template>
  <v-card class="mx-auto" :link="true" hover :to="`/video/${video.id}`">
    <v-row no-gutters>
      <v-col cols="5">
        <v-img :src="video.thumbnail" :alt="`Thumbnail for ${video.title}`" :aspect-ratio="16 / 9" />
      </v-col>
      <v-col cols="7">
        <v-card-item>
          <v-card-title class="text-truncate pa-0 text-body-2" :title="video.title">
            <v-icon v-if="video.explicit" class="alpha-e-box mr-1" size="16" icon="mdi-alpha-e-box" />
            {{ video.title }}
          </v-card-title>

          <NuxtLink :to="`/artist/${mainArtist.id}`" class="d-flex align-center mb-1 pa-0 text-decoration-none">
            <v-avatar size="20" class="mr-1">
              <v-img :src="mainArtist.thumbnail" :alt="`${mainArtist.name} avatar`" />
            </v-avatar>
            <span class="text-caption text-truncate text-black">{{ mainArtist.name }}</span>
          </NuxtLink>

          <v-card-subtitle class="pa-0 text-caption">
            {{ video.viewCounts.total.toLocaleString() }} views • {{ formatDuration(video.duration) }}
          </v-card-subtitle>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  video: Video;
}>();

const mainArtist = ref<Artist>(props.video.artists?.[0]?.artist!);
</script>
