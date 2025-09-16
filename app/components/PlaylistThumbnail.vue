<script lang="ts" setup>
defineProps<{
  playlist: Playlist;
}>();
</script>

<template>
  <v-card :link="true" hover :to="`/playlist?playlistId=${playlist.id}`" :width="200" height="180">
    <v-img :src="playlist.basicMeta.image_url" :alt="`Thumbnail for ${playlist.basicMeta.title}`" cover
      :aspect-ratio="16 / 9" />
    <v-card-item>
      <v-card-title class="text-wrap text-center text-body-1">
        {{ playlist.basicMeta.title }}
      </v-card-title>
    </v-card-item>
  </v-card>
</template>
