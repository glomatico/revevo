<script lang="ts" setup>
defineProps<{
  playlist: Playlist;
}>();
</script>

<template>
  <v-card :to="`/playlist/${playlist.id}`" min-width="300">
    <v-row no-gutters align="center">
      <v-col cols="12">
        <v-img :src="playlist.basicMeta.image_url" :alt="`Thumbnail for ${playlist.basicMeta.title}`"
          :aspect-ratio="16 / 9" cover />
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-center text-truncate">{{ playlist.basicMeta.title }}</p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
