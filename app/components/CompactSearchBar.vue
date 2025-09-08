<template>
  <v-btn icon variant="text" @click="handleMagnifyClick" v-if="!isSearchOpen">
    <v-icon>mdi-magnify</v-icon>
  </v-btn>

  <div v-if="isSearchOpen" class="d-flex ga-2 w-100">
    <v-btn icon variant="text" @click="handleMagnifyClick">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-text-field label="Search" variant="solo" density="compact" prepend-inner-icon="mdi-magnify" outlined dense
      hide-details @keyup.enter="search()" v-model="query">
      <template #append-inner>
        <v-btn icon variant="text" @click="search">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  magnifyClicked: [isOpen: boolean]
}>()

const router = useRouter();
const route = useRoute();

const query = ref<string>(route.query.q as string || '');
const isSearchOpen = ref<boolean>(false);

const handleMagnifyClick = () => {
  isSearchOpen.value = !isSearchOpen.value;
  emit('magnifyClicked', isSearchOpen.value);
};

const search = async () => {
  if (!query.value.trim()) return;
  await router.push({
    path: '/search',
    query: {
      q: query.value,
    }
  });
};
</script>
