<template>
  <v-toolbar color="surface">
    <v-container>
      <v-row align="center">
        <v-col cols="8">
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
    </v-container>
  </v-toolbar>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.toolbar-title {
  all: unset;
  cursor: pointer;
  display: inline;
}
</style>
