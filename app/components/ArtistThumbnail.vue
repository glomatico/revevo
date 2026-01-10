<script lang="ts" setup>
const props = defineProps<{
  artist: any;
}>();
</script>

<template>
  <v-card :to="`/artist/${props.artist.id}`">
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <v-img class="ma-2" :src="props.artist.thumbnail" :alt="`Profile avatar of ${props.artist.name}.`"
          rounded="circle" :aspect-ratio="1" width="120">
          <div v-if="!props.artist.thumbnail">
            <v-icon size="120">
              mdi-account-circle
            </v-icon>
          </div>
        </v-img>
      </v-col>

      <v-col cols="12">
        <v-card-item>
          <p class="text-center text-truncate">{{ props.artist.name }}</p>
        </v-card-item>
      </v-col>
    </v-row>
  </v-card>
</template>
