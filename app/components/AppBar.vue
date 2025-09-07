<template>
  <v-toolbar color="surface">
    <v-container>
      <div class="d-none d-md-flex">
        <v-row align="center">
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
      </div>

      <div class="d-flex d-md-none">
        <v-row justify="space-between" align="center">
          <v-toolbar-title v-if="isLogoVisible">
            <NuxtLink class="toolbar-title" to="/">
              <p class="text-h4 font-weight-bold">Revevo</p>
            </NuxtLink>
          </v-toolbar-title>

          <CompactSearchBar @magnify-clicked="isLogoVisible = !isLogoVisible" />
        </v-row>
      </div>
    </v-container>
  </v-toolbar>
</template>

<script lang="ts" setup>
const isLogoVisible = ref<boolean>(true);
</script>

<style scoped>
.toolbar-title {
  all: unset;
  cursor: pointer;
  display: inline;
}
</style>
