import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

import { md3 } from 'vuetify/blueprints'


export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'dark',
        },
        blueprint: md3,
    })
    app.vueApp.use(vuetify)
})
