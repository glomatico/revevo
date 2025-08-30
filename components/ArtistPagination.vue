<template>
  <div class="text-center">
    <v-pagination v-model="page" :length="length" rounded="circle" @update:model-value="onPageChange"></v-pagination>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  itemsCount: number;
  pageIndex: number;
}>();

const emit = defineEmits<{
  pageChange: [pageIndex: number];
}>();

const length = ref<number>(Math.ceil(props.itemsCount / 32));
const page = ref<number>(props.pageIndex);

const onPageChange = (newPage: number) => {
  const pageIndex = newPage;
  emit('pageChange', pageIndex);
};
</script>
