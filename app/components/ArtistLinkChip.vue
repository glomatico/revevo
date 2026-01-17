<script lang="ts" setup>
const props = defineProps<{
  artist: any;
}>();
</script>


<template>
  <v-chip rounded :to="`/artist/${props.artist.id}`" variant="outlined">
    <v-row dense align="center">
      <v-col>
        <v-avatar>
          <v-img v-if="props.artist.thumbnail" :src="props.artist.thumbnail"
            :alt="`Profile avatar for ${props.artist.name}`" />

          <v-icon v-else size="26" icon="mdi-account-circle" />
        </v-avatar>
      </v-col>

      <v-col>
        <p>
          {{ props.artist.name }}
        </p>
      </v-col>
    </v-row>
  </v-chip>
</template>
