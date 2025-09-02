<template>
  <v-text-field readonly dense :value="value">
    <template #append-inner>
      <v-btn icon variant="text" @click="copyToClipboard">
        <v-icon>mdi-content-copy</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script lang="ts" setup>
const props = defineProps<{
  value: string;
}>();

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.value);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
};
</script>
