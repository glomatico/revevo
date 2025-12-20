<script lang="ts" setup>
defineProps<{
  label: string;
  url: string;
}>();
</script>

<template>
  <tr>
    <td>
      {{ label }}
    </td>

    <td>
      <CopyableReadOnlyField :value="url" />
    </td>
  </tr>
</template>
