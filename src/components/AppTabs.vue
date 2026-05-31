<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps<{
  tabs: string[];
  routeParamKey?: string;
}>();

const currentTab = defineModel<string>("currentTab");
const route = useRoute();
const router = useRouter();

const tab = computed({
  get: () => {
    const value = props.routeParamKey ? route.query[props.routeParamKey] : null;
    if (typeof value === "string" && props.tabs.includes(value)) {
      return value;
    }

    return currentTab.value || props.tabs[0];
  },
  set: async (value: string) => {
    currentTab.value = value;

    if (!props.routeParamKey) {
      return;
    }

    const query = { ...route.query };
    if (value === props.tabs[0]) {
      delete query[props.routeParamKey];
    } else {
      query[props.routeParamKey] = value;
    }

    await router.push({
      path: route.path,
      query,
    });
  },
});
</script>

<template>
  <v-row>
    <v-col cols="12">
      <v-tabs v-model="tab" align-tabs="center">
        <v-tab v-for="tabName in props.tabs" :key="tabName" class="text-none text-capitalize" :value="tabName">
          {{ tabName }}
        </v-tab>
      </v-tabs>

      <v-divider thickness="2" />
    </v-col>

    <v-col cols="12">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="tabName in props.tabs" :key="tabName" :value="tabName">
          <slot :name="tabName" />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-row>
</template>
