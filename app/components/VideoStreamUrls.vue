<script lang="ts" setup>
const dialogVisible = ref(false);
</script>

<template>
  <v-btn block variant="outlined" class="text-none" @click="dialogVisible = true">Show Stream URLs</v-btn>

  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-item>
        <v-row dense>
          <v-col cols="12">
            <p class="text-h6">Stream URLs</p>
          </v-col cols="12">

          <v-col>
            <v-table>
              <tbody>
                <slot />
              </tbody>
            </v-table>
          </v-col>

          <v-col cols="12" align="end">
            <v-btn variant="outlined" class="text-none" @click="dialogVisible = false">Close</v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
