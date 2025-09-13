<template>
  <v-pagination v-model="page" :length="pageCount" rounded="circle"></v-pagination>
</template>

<script lang="ts" setup>
defineProps<{
  pageCount: number;
}>();

const emit = defineEmits<{
  pageChange: [value: number];
}>();

const router = useRouter();
const route = useRoute();

const page = computed<number>({
  get: () => parseInt((route.query.p as string) || '1', 10),
  set: async (value: number) => {
    const newQuery = { ...route.query };
    if (value === 1) {
      delete newQuery.p;
    } else {
      newQuery.p = value.toString();
    }

    await router.push({
      path: route.path,
      query: newQuery
    });
  }
});


watch(page, async () => {
  emit('pageChange', page.value);
});
</script>
