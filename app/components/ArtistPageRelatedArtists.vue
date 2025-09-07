<template>
  <v-row>
    <v-col v-if="relatedArtists.length !== 0" v-for="artist in relatedArtists" cols="12" sm="6" md="4" lg="3">
      <ArtistThumbnail :artist="artist" />
    </v-col>
    <v-col v-else cols="12">
      <v-alert type="info">No related artists found.</v-alert>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const props = defineProps<{
  artist: Artist;
}>();

const relatedArtists = ref<BasicArtistMeta[]>(props.artist.relatedArtists?.filter(a => a.name != props.artist.basicMeta.name) || []);
</script>