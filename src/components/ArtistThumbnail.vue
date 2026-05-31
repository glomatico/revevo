<script setup lang="ts">
const props = defineProps<{
  artist: any;
}>();
</script>

<template>
  <v-card :to="`/artist/${props.artist.id}`" variant="text">
    <v-row dense align="center">
      <v-col cols="12" align="center">
        <v-img :src="props.artist.thumbnail" :alt="`Profile avatar of ${props.artist.name}.`" rounded="circle"
          :aspect-ratio="1" width="120">
          <div v-if="!props.artist.thumbnail">
            <v-icon size="120" icon="mdi-account-circle" />
          </div>
        </v-img>
      </v-col>

      <v-col cols="12">
        <p class="text-center text-truncate font-weight-bold ma-0">
          {{ props.artist.name }}
        </p>
      </v-col>
    </v-row>
  </v-card>
</template>
