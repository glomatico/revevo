<template>
  <div class="d-flex ga-2">
    <v-chip v-for="(artist, index) in artistsFiltered" :key="artist.artist.name" :to="`/artist/${artist.artist.id}`">
      <v-avatar v-if="addAvatar" class="mr-1">
        <v-img :src="artist.artist.thumbnail" :alt="`Avatar for ${artist.artist.name}`" />
      </v-avatar>
      <p>
        {{ artist.artist.name }}
      </p>
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoArtists: VideoArtist[];
  mainOnly?: boolean;
  addAvatar?: boolean;
}>();

const artistsFiltered = ref<VideoArtist[]>([]);

onMounted(async () => {
  if (props.mainOnly) {
    artistsFiltered.value = props.videoArtists.filter(artist => artist.role === 'main');
  } else {
    artistsFiltered.value = props.videoArtists;
  }
});
</script>
