<template>
  <NuxtLink v-for="(artist, index) in artistsFiltered" :key="artist.basicMeta.name"
    :to="`/artist/${artist.basicMeta.urlSafeName}`" class="text-decoration-none">
    {{ artist.basicMeta.name + (index == artistsFiltered.length - 1 ? '' : ',&nbsp;') }}
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps<{
  videoArtists: Artist[];
  mainOnly?: boolean;
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
