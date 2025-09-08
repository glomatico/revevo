<template>
  <v-tabs v-model="tab" align-tabs="center">
    <v-tab v-for="tab in tabs" :key="tab" :value="tab">{{ wordfy(tab) }}</v-tab>
  </v-tabs>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tabs: string[],
  routeParamKey: string,
  defaultTab: string
}>()

const emit = defineEmits<{
  tabChange: [value: string]
}>()

const route = useRoute();
const router = useRouter();

const tab = computed<string>({
  get: () => (route.query[props.routeParamKey] as string) || props.defaultTab,
  set: async (value: string) => {
    const newQuery = { ...route.query };
    if (value === props.defaultTab) {
      delete newQuery[props.routeParamKey];
    } else {
      newQuery[props.routeParamKey] = value;
    }

    await router.push({
      path: route.path,
      query: newQuery
    });
  }
});

const wordfy = (value: string) => {
  return value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
};

watch(tab, async () => {
  emit('tabChange', tab.value);
});
</script>
