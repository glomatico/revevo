<template>
  <NuxtLink v-for="(artist, index) in videoArtists" :key="artist.artist.name" :to="`/artist/${artist.artist.id}`">
    <v-chip v-if="useChips" class="ma-1">
      {{ artist.artist.name }}
    </v-chip>
    <span v-else>
      {{ artist.artist.name }}<span v-if="index < videoArtists.length - 1">, </span>
    </span>
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{
  videoArtists: VideoArtist[];
  useChips?: boolean;
}>();
</script>
