<template>
  <v-text-field label="Search" prepend-inner-icon="mdi-magnify" outlined dense hide-details width="400px"
    @keyup.enter="search($event.target.value)" v-model="query">
  </v-text-field>
</template>

<script lang="ts" setup>
const router = useRouter();

const query = ref<string>('');

const search = async (query: string) => {
  if (!query.trim()) return;
  await router.push({ path: '/search', query: { q: query } });
};
</script>
