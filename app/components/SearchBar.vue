<template>
  <v-text-field label="Search" prepend-inner-icon="mdi-magnify" outlined dense hide-details width="400px"
    @keyup.enter="search($event.target.value)" v-model="query">
    <template #append>
      <v-btn icon @click="search(query)" class="mt-n1">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </template>
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
