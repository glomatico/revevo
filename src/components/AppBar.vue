<script setup lang="ts">
import { ref } from 'vue';
import AppSearchBar from './AppSearchBar.vue';
import CompactSearchBar from './CompactSearchBar.vue';
import AppMenu from './AppMenu.vue';

const isMenuVisible = ref(false);
const isSearchVisible = ref(false);
</script>

<template>
  <AppMenu v-model:visible="isMenuVisible" />

  <v-app-bar>
    <v-container>
      <v-row align="center">
        <template v-if="!isSearchVisible">
          <v-col cols="auto">
            <v-btn icon="mdi-menu" variant="text" @click="isMenuVisible = true" />
          </v-col>

          <v-col cols="auto">
            <v-chip variant="text" to="/">
              <v-toolbar-title class="font-weight-bold">
                {{ $t('app.title') }}
              </v-toolbar-title>
            </v-chip>
          </v-col>

          <v-col v-if="$vuetify.display.mdAndUp" align="center">
            <AppSearchBar />
          </v-col>
        </template>

        <v-col v-if="$vuetify.display.smAndDown || isSearchVisible" align="right">
          <CompactSearchBar v-model:visible="isSearchVisible" />
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>
