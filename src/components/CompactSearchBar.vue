<script setup lang="ts">
import AppSearchBar from './AppSearchBar.vue';

const visible = defineModel<boolean>("visible");
</script>

<template>
  <v-row dense align="center">
    <v-col v-if="!visible">
      <v-btn icon="mdi-magnify" variant="text" @click="visible = true" />
    </v-col>

    <template v-if="visible">
      <v-col cols="auto">
        <v-btn icon="mdi-arrow-left" variant="text" @click="visible = false" />
      </v-col>

      <v-col align="center">
        <AppSearchBar />
      </v-col>
    </template>
  </v-row>
</template>