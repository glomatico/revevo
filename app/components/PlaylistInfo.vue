<script lang="ts" setup>
const props = defineProps<{
  playlist: any;
}>();
</script>

<template>
  <v-card variant="text">
    <v-img :src="props.playlist.thumbnail" :aspect-ratio="16 / 9" />
    <v-card-item class="text-center">
      <p class="text-h4 font-weight-bold">{{ props.playlist.title }}</p>

      <p v-if="props.playlist.description">
        {{ props.playlist.description }}
      </p>

      <p>
        {{ props.playlist.itemsCount }} video{{ props.playlist.itemsCount !== 1 ? 's' : '' }}
      </p>
    </v-card-item>
  </v-card>
</template>
