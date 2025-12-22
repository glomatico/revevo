<script lang="ts" setup>
const props = defineProps<{
  tabs: string[],
  routeParamKey: string,
}>();

const route = useRoute();
const router = useRouter();

const tab = computed({
  get: () => {
    const value = route.query[props.routeParamKey];
    return typeof value === 'string' ? value : props.tabs[0];
  },
  set: async (value: string) => {
    const newQuery = { ...route.query };
    if (value === props.tabs[0]) {
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
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-model="tab" align-tabs="center">
        <v-tab class="text-none text-capitalize" v-for="tab in tabs" :key="tab" :value="tab">{{ tab }}</v-tab>
      </v-tabs>

      <v-divider thickness="2" />
    </v-col>

    <v-col cols="12">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="tabName in tabs" :key="tabName" :value="tabName">
          <slot :name="tabName" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
</template>
