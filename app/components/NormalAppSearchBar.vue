<script lang="ts" setup>
const route = useRoute();

const searchQuery = ref(route.query.q ?? "");

const search = async () => {
  if (!searchQuery.value) return;

  await navigateTo({
    path: '/search',
    query: {
      ...route.query,
      q: searchQuery.value,
    },
  });
}
</script>

<template>
  <v-row align="center">
    <v-col align="center">
      <v-text-field rounded label="Search" variant="solo" single-line density="compact" outlined dense hide-details
        @keyup.enter="search" v-model="searchQuery" max-width="600">
        <template #append-inner>
          <v-btn size="small" variant="text" @click="search" icon="mdi-send" />
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>
