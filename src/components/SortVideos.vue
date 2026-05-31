<script setup lang="ts">
import { computed } from 'vue';

const selected = defineModel<string>("selected");

const selectedSort = computed(() => [selected.value || "original"]);

const sortOptions = [
  { value: 'original', label: 'artist.sort.original', icon: 'mdi-swap-vertical' },
  { value: 'views', label: 'artist.sort.views', icon: 'mdi-eye' },
  { value: 'date', label: 'artist.sort.date', icon: 'mdi-calendar' },
  { value: 'a-z', label: 'artist.sort.a-z', icon: 'mdi-sort-alphabetical-ascending' },
];
</script>

<template>
  <v-menu>
    <template #activator="{ props }">
      <v-btn variant="outlined" rounded v-bind="props">
        {{ $t('artist.sort.sortBy') }}
        <template #append>
          <v-icon icon="mdi-chevron-down" />
        </template>
      </v-btn>

    </template>
    <v-list v-model:selected="selectedSort">
      <v-list-item v-for="option in sortOptions" :key="option.value" :value="option.value" :prepend-icon="option.icon"
        @click="selected = option.value">
        <v-list-item-title>
          {{ $t(option.label) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
