<template>
  <v-toolbar color="primary">
    <v-container>
      <v-row align="center">
        <v-col>
          <v-toolbar-title>
            <NuxtLink class="toolbar-title" to="/">
              <h2>Revevo</h2>
            </NuxtLink>
          </v-toolbar-title>
        </v-col>
        <SearchBar />
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
