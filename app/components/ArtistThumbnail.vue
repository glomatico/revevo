<template>
  <v-card :link="true" hover :to="`/artist/${artist.urlSafeName}`">
    <v-card-item align="center">
      <v-avatar size="50%">
        <v-img :src="artist.thumbnailUrl" :alt="`Profile avatar for ${artist.name}`" :aspect-ratio="1" />
      </v-avatar>
    </v-card-item>

    <v-card-title class="text-truncate text-center">
      {{ artist.name }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
defineProps<{
  artist: BasicArtistMeta;
}>();
</script>
