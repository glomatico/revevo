<template>
  <v-text-field label="Search" variant="solo" density="compact" prepend-inner-icon="mdi-magnify" outlined dense
    hide-details @keyup.enter="search()" v-model="query">
    <template #append-inner>
      <v-btn icon variant="text" @click="search">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script lang="ts" setup>
const router = useRouter();
const route = useRoute();

const query = computed<string>(() => (route.query.q as string) || '');

const search = async () => {
  if (!query.value.trim()) return;
  await router.push({ path: '/search', query: { q: query.value } });
};
</script>
