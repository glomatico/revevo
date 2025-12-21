<template>
  <NuxtLink :to="`/artist/${artistId}`" class="text-decoration-none">
    {{ artistName + (last ? '' : ',&nbsp;') }}
  </NuxtLink>
</template>

<script lang="ts" setup>
defineProps<{
  artistId: string;
  artistName: string;
  last?: boolean;
}>();
</script>
