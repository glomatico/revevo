<template>
  <v-footer class="app-footer" color="surface">
    <v-container>
      <v-row align="center">
        <v-col>
          <p>Made by Glomatico </p>
          <p>This project is not affiliated with or endorsed by Vevo</p>
        </v-col>

        <v-col align="right">
          <v-btn href="https://github.com/glomatico/revevo" target="_blank" icon="mdi-github" class="mx-4" size="medium"
            variant="plain" />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.app-footer {
  max-height: 96px;
}
</style>