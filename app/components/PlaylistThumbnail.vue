<script lang="ts" setup>
const props = defineProps<{
  playlist: any;
}>();
</script>

<template>
  <v-card :to="`/playlist/${props.playlist.id}`">
    <v-row no-gutters align="center">
      <v-col cols="12">
        <v-img :src="props.playlist.thumbnail" :alt="`Thumbnail for ${props.playlist.title}`" :aspect-ratio="16 / 9"
          cover />
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-center text-truncate">{{ props.playlist.title }}</p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
