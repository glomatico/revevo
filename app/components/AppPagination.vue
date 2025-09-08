<template>
  <v-pagination v-model="pageIndex" :length="length" rounded="circle" @update:model-value="onPageChange"></v-pagination>
</template>

<script lang="ts" setup>
const props = defineProps<{
  itemsCount: number;
}>();
const router = useRouter();
const route = useRoute();

const length = ref<number>(Math.ceil(props.itemsCount / 32));
const pageIndex = computed<number>(() => parseInt((route.query.p as string) || '1', 10));

const onPageChange = (newPage: number) => {
  const pageIndex = newPage;
  if (pageIndex === 1) {
    const newQuery = { ...route.query };
    delete newQuery.p;
    router.push({ path: route.path, query: newQuery });
  } else {
    router.push({ path: route.path, query: { ...route.query, p: pageIndex.toString() } });
  }
};
</script>
