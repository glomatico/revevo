<template>
  <AppMenu ref="appMenu" />
  <v-toolbar color="surface">
    <v-container class="d-flex align-center">
      <template v-if="!mobile">
        <v-app-bar-nav-icon @click="toggleDrawer" />

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
        <template v-if="isLogoVisible">
          <v-app-bar-nav-icon @click="toggleDrawer" />

          <v-toolbar-title>
            <NuxtLink class="toolbar-title" to="/">
              <p class="text-h4 font-weight-bold">Revevo</p>
            </NuxtLink>
          </v-toolbar-title>
        </template>

        <CompactSearchBar @magnify-clicked="toggleLogo" />
      </template>
    </v-container>
  </v-toolbar>
</template>

<script lang="ts" setup>
const isLogoVisible = ref<boolean>(true);
import { useDisplay } from 'vuetify';

const { mobile } = useDisplay();

const appMenu = ref();

const toggleDrawer = () => {
  appMenu.value?.toggleDrawer();
};

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
