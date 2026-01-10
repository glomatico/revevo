<script lang="ts" setup>
defineProps<{
  artists: any[];
}>();
</script>

<template>
  <template v-for="(artist, index) in artists">
    <NuxtLink :to="`/artist/${artist.artist.id}`" class="text-decoration-none">
      {{ artist.artist.name + (index === artists.length - 1 ? '' : ',&nbsp;') }}
    </NuxtLink>
  </template>
</template>
