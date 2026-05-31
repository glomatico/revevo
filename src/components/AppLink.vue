<script lang="ts" setup>
defineProps<{
  to: string;
}>();
</script>

<template>
  <RouterLink :to="to" style="color: inherit; text-decoration: none;">
    <slot />
  </RouterLink>
</template>
