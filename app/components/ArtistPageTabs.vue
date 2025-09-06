<template>
  <v-tabs v-model="currentTab" @update:model-value="emit('tabChange', currentTab);" align-tabs="center">
    <v-tab value="videos">Videos</v-tab>
    <v-tab value="about">About</v-tab>
    <v-tab value="related">Related Artists</v-tab>
  </v-tabs>
</template>

<script lang="ts" setup>
const props = defineProps<{
  initialValue: string;
}>();

const emit = defineEmits<{
  tabChange: [newCurrentTab: string];
}>();

const currentTab = ref<string>(props.initialValue);
</script>
