import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    public: {
      tokenApiUrl: process.env.TOKEN_API_URL || 'https://accounts.vevo.com/token',
      graphqlApiUrl: process.env.VEVO_GRAPHQL_API_URL || 'https://veil.vevoprd.com/graphql',
      captionsApiUrl: process.env.CAPTIONS_API_URL || 'https://api.vevo.com/captions',
      captionsToken: process.env.CAPTIONS_TOKEN || 'fny8q3azy3jy94wsjavj3hr3gc',
    }
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
