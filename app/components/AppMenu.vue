<script lang="ts" setup>
const isDrawerVisible = ref<boolean>(false);
const drawerItems = ref<PageMetadata[]>([
  { title: 'Home', path: '/', icon: 'mdi-home' },
  { title: 'Settings', path: '/settings', icon: 'mdi-cog' },
]);

const toggleDrawer = () => {
  isDrawerVisible.value = !isDrawerVisible.value;
}

defineExpose({
  toggleDrawer
});
</script>

<template>
  <ClientOnly>
    <v-navigation-drawer temporary v-model="isDrawerVisible" scrim>
      <v-list>
        <v-list-item v-for="item in drawerItems" :title="item.title" :to="item.path" :key="item.title"
          :prepend-icon="item.icon" @click="isDrawerVisible = false"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </ClientOnly>
</template>
