<script setup lang="ts">
import AppBar from '@/components/AppBar.vue';
import AppFooter from '@/components/AppFooter.vue';
import { useSettings } from '@/composables/useSettings';
import { onBeforeMount, ref } from 'vue';

const { initialize } = useSettings();
const settingsLoaded = ref(false);

onBeforeMount(() => {
  initialize();
});
</script>

<template>
  <AppBar />

  <v-main>
    <RouterView />
  </v-main>

  <AppFooter />
</template>
