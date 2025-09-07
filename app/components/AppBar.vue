<template>
  <v-toolbar color="surface">
    <v-container>
      <v-row align="center" class="d-none d-md-flex">
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

      <v-row align="center" class="d-md-none ma-0">
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
