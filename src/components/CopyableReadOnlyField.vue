<script setup lang="ts">
const props = defineProps<{
  value: string;
}>();

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
  } catch (error) {
    console.error("Failed to copy text:", error);
  }
};
</script>

<template>
  <v-text-field rounded :model-value="props.value" readonly density="comfortable" hide-details variant="outlined">
    <template #append-inner>
      <v-btn icon variant="text" @click="copyToClipboard">
        <v-icon icon="mdi-content-copy" />
      </v-btn>
    </template>
  </v-text-field>
</template>
