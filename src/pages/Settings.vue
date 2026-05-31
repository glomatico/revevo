<script setup lang="ts">
import { PlaybackMethod } from '@/composables/enums';
import { usePageTitle } from '@/composables/usePageTitle';
import { useSettings } from '@/composables/useSettings';

const { settings, resetSettings } = useSettings();

usePageTitle('Settings');
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="ma-0">
          {{ $t('settings.title') }}
        </h1>

        <v-divider thickness="2" />
      </v-col>

      <v-col>
        <v-col cols="auto">
          <v-btn variant="outlined" rounded prepend-icon="mdi-restore" @click="resetSettings">
            {{ $t('settings.reset') }}
          </v-btn>
        </v-col>
      </v-col>

      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <v-card variant="text">
              <v-card-title class="px-0">
                {{ $t('settings.playbackMethod') }}
              </v-card-title>

              <v-card-text class="px-0">
                <v-radio-group v-model="settings.playbackMethod" hide-details>
                  <v-radio label="HLS" :value="PlaybackMethod.HLS" />
                  <v-radio label="MP4" :value="PlaybackMethod.MP4" />
                </v-radio-group>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card variant="text">
              <v-list lines="two" bg-color="background">
                <v-list-item :title="$t('settings.enableCaptions')" :subtitle="$t('settings.enableCaptionsHint')">
                  <template #append>
                    <v-switch v-model="settings.enableCaptions" color="primary" hide-details />
                  </template>
                </v-list-item>

                <v-list-item :title="$t('settings.hideExplicit')" :subtitle="$t('settings.hideExplicitHint')">
                  <template #append>
                    <v-switch v-model="settings.hideExplicit" color="primary" hide-details />
                  </template>
                </v-list-item>

                <v-list-item :title="$t('settings.disableAutoplay')" :subtitle="$t('settings.disableAutoplayHint')">
                  <template #append>
                    <v-switch v-model="settings.disableAutoplay" color="primary" hide-details />
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
