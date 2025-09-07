<template>
  <v-toolbar class="text-white">
    <v-container class="d-flex align-center">
      <template v-if="!mobile">
        <v-toolbar-title>
          <NuxtLink class="toolbar-title" to="/">
            <p class="text-h4 font-weight-bold">Revevo</p>
          </NuxtLink>
        </v-toolbar-title>

        <v-sheet width="400">
          <SearchBar />
        </v-sheet>
      </template>

      <template v-else>
        <v-toolbar-title v-if="isLogoVisible">
          <NuxtLink class="toolbar-title" to="/">
            <p class="text-h4 font-weight-bold">Revevo</p>
          </NuxtLink>
        </v-toolbar-title>

        <CompactSearchBar @magnify-clicked="toggleLogo" />
      </template>
    </v-container>
  </v-toolbar>
</template>

<script lang="ts" setup>
const isLogoVisible = ref<boolean>(true);
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const toggleLogo = (isSearchOpen: boolean) => {
  isLogoVisible.value = !isSearchOpen;
};
</script>

<style scoped>
.toolbar-title {
  all: unset;
  cursor: pointer;
}
</style>
