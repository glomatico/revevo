<script lang="ts" setup>
defineProps<{
  to: string;
}>();
</script>

<template>
  <NuxtLink :to="to" style="color: inherit; text-decoration: none;">
    <slot />
  </NuxtLink>
</template>
