<template>
  <v-card :link="true" hover :to="`/artist/${artist.urlSafeName}`">
    <v-card-item align="center">
      <v-avatar size="50%">
        <v-img :src="resizedAvatarUrl" :alt="`Profile avatar for ${artist.name}`" :aspect-ratio="1" />
      </v-avatar>
    </v-card-item>

    <v-card-title class="text-truncate text-center">
      {{ artist.name }}
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artist: BasicArtistMeta;
}>();

const resizedAvatarUrl = resizeImageUrl(props.artist.thumbnailUrl, 256, 256);
</script>
