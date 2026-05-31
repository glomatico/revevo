<script setup lang="ts">
</script>

<template>
  <v-footer class="app-footer">
    <v-container>
      <v-row align="center">
        <v-col>
          <p>{{ $t('footer.createdBy', { name: 'Glomatico' }) }}</p>

          <p>{{ $t('footer.notAffiliated') }}</p>
        </v-col>

        <v-col align="right">
          <v-btn href="https://github.com/glomatico/revevo" target="_blank" icon="mdi-github" variant="plain" />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.app-footer {
  max-height: 96px;
}
</style>
