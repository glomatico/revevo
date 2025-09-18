<script lang="ts" setup>
defineProps<{
  playlist: Playlist;
}>();
</script>

<template>
  <v-card variant="text">
    <v-img :src="playlist.basicMeta.image_url" :aspect-ratio="16 / 9" />
    <v-card-item class="text-center">
      <p class="text-h4 font-weight-bold">{{ playlist.basicMeta.title }}</p>
      <p v-if="playlist.basicMeta.description">
        {{ playlist.basicMeta.description }}
      </p>
      <p>
        <template v-if="playlist.basicMeta.curated">
          Curated Playlist •
        </template>
        {{ playlist.basicMeta.videoCount }} video{{ playlist.basicMeta.videoCount !== 1 ? 's' : '' }}
      </p>
    </v-card-item>
  </v-card>
</template>
