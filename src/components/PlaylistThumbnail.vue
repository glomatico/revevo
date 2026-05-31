<script setup lang="ts">
const props = defineProps<{
  playlist: any;
}>();
</script>

<template>
  <v-card variant="text" :to="`/playlist/${props.playlist.id}`">
    <v-row dense align="center">
      <v-col cols="12">
        <v-img rounded :src="props.playlist.thumbnail" :alt="`Thumbnail for ${props.playlist.title}.`"
          :aspect-ratio="16 / 9" cover />
      </v-col>

      <v-col cols="12">
        <p class="text-center text-truncate font-weight-bold ma-0">
          {{ props.playlist.title }}
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>
