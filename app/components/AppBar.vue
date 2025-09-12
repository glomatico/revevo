<script lang="ts" setup>
const appMenu = ref();
const isLogoVisible = ref<boolean>(true);

const toggleLogo = (isSearchOpen: boolean) => {
  isLogoVisible.value = !isSearchOpen;
};
</script>

<template>
  <AppMenu ref="appMenu" />
  <v-toolbar color="surface">
    <v-container>
      <div class="d-none d-sm-flex align-center">
        <v-app-bar-nav-icon @click="appMenu.toggleDrawer()" />

        <v-toolbar-title>
          <NuxtLink class="text-decoration-none text-white" to="/">
            Revevo
          </NuxtLink>
        </v-toolbar-title>

        <v-sheet width="400">
          <SearchBar />
        </v-sheet>
      </div>

      <div class="d-flex d-sm-none align-center">
        <template v-if="isLogoVisible">
          <v-app-bar-nav-icon @click="appMenu.toggleDrawer()" />

          <v-toolbar-title>
            <NuxtLink class="text-decoration-none text-white" to="/">
              Revevo
            </NuxtLink>
          </v-toolbar-title>
        </template>

        <CompactSearchBar @magnify-clicked="toggleLogo" />
      </div>
    </v-container>
  </v-toolbar>
</template>
