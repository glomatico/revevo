<template>
  <v-toolbar color="surface">
    <v-container>
      <v-row v-if="!mobile" align="center">
        <v-col cols="6">
          <v-toolbar-title>
            <NuxtLink class="toolbar-title" to="/">
              <p class="text-h4 font-weight-bold">Revevo</p>
            </NuxtLink>
          </v-toolbar-title>
        </v-col>

        <v-col>
          <SearchBar />
        </v-col>
      </v-row>

      <v-row v-else align="center">
        <v-col v-if="isLogoVisible" cols="auto">
          <v-toolbar-title>
            <NuxtLink class="toolbar-title" to="/">
              <p class="text-h4 font-weight-bold">Revevo</p>
            </NuxtLink>
          </v-toolbar-title>
        </v-col>

        <v-col class="text-end">
          <CompactSearchBar @magnify-clicked="toggleLogo" />
        </v-col>
      </v-row>
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
