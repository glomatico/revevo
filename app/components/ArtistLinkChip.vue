<template>
  <div class="d-flex ga-2 flex-wrap">
    <v-chip v-for="artist in artistsFiltered" :key="artist.basicMeta.name"
      :to="`/artist/${artist.basicMeta.urlSafeName}`">
      <v-avatar v-if="addAvatar" class="mr-1">
        <v-img :src="artist.basicMeta.thumbnailUrl" :alt="`Avatar for ${artist.basicMeta.name}`" />
      </v-avatar>
      <p>
        {{ artist.basicMeta.name }}
      </p>
    </v-chip>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoArtists: Artist[];
  mainOnly?: boolean;
  addAvatar?: boolean;
}>();

const artistsFiltered = ref<Artist[]>([]);

onMounted(async () => {
  if (props.mainOnly) {
    artistsFiltered.value = props.videoArtists.filter(artist => artist.basicMeta.role === 'main');
  } else {
    artistsFiltered.value = props.videoArtists;
  }
});
</script>
