<template>
  <v-card variant="text">
    <v-img :src="playlist.basicMeta.image_url" :aspect-ratio="16 / 9" />
    <v-card-item class="text-center">
      <v-card-title>{{ playlist.basicMeta.title }}</v-card-title>
      <v-card-text v-if="playlist.basicMeta.description">
        {{ playlist.basicMeta.description }}
      </v-card-text>
      <v-card-subtitle>
        <template v-if="playlist.basicMeta.curated">
          Curated Playlist •
        </template>
        {{ playlist.basicMeta.videoCount }} video{{ playlist.basicMeta.videoCount !== 1 ? 's' : '' }}
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  playlist: Playlist;
}>();
</script>
