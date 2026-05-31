<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const query = ref('');

const handleSearch = () => {
  const queryTrimmed = query.value.trim();
  if (queryTrimmed) {
    router.push(`/search/${encodeURIComponent(queryTrimmed)}`);
  }
};
</script>

<template>
  <v-text-field v-model="query" rounded :placeholder="$t('app.search')" outlined dense hide-details variant="outlined"
    density="compact" @keyup.enter="handleSearch" max-width="600" />
</template>
