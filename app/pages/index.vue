<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <p class="text-h4 font-weight-bold">
          Welcome!
        </p>
      </v-col>

      <v-divider thickness="2" class="my-2" />

      <v-col cols="12">
        <p>
          Welcome to Revevo - a music video streaming website that recreates the old Vevo experience using their
          still-active internal APIs.
        </p>
      </v-col>
      <v-col cols="12">
        <p>
          Although the official Vevo website shut down years ago, many parts of its backend remain online. Revevo
          bridges
          the gap by using those APIs to revive the classic Vevo experience, offering a vast library of high-quality
          music videos enriched with detailed metadata.
        </p>
      </v-col>
      <v-col cols="12">
        <p>
          Go ahead and start searching for your favorite artists and videos using the search bar above!
        </p>
      </v-col>
      <v-col cols="12">
        <p>
          This project is open source, and you can find the code on
          <a href="https://github.com/glomatico/revevo" target="_blank">GitHub</a>.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
useSeoMeta({
  title: 'Revevo',
  ogTitle: 'Revevo',
  description: 'A music video streaming website that recreates the old Vevo experience using their still-active internal APIs.',
  ogDescription: 'A music video streaming website that recreates the old Vevo experience using their still-active internal APIs.',
  ogImage: 'https://img.vevo.com/images/defaultbackstageassets/vevo.png?width=720&height=720',
  twitterCard: 'summary_large_image',
})
</script>
