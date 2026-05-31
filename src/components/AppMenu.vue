<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const visible = defineModel<boolean>("visible");

const { t } = useI18n();

const drawerItems = ref([
  { title: t('app.menu.home'), path: '/', icon: 'mdi-home' },
  { title: t('app.menu.settings'), path: '/settings', icon: 'mdi-cog' },
]);
</script>

<template>
  <v-navigation-drawer temporary v-model="visible" scrim>
    <v-list>
      <v-list-item v-for="item in drawerItems" :title="item.title" :to="item.path" :key="item.title"
        :prepend-icon="item.icon" @click="visible = false" />
    </v-list>
  </v-navigation-drawer>
</template>
