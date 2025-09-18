import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { VVideo } from 'vuetify/labs/VVideo'
import { VIconBtn } from 'vuetify/labs/VIconBtn'

import { md3 } from 'vuetify/blueprints'


export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'dark',
        },
        components: {
            VVideo,
            VIconBtn,
        },
        blueprint: md3,
    })
    app.vueApp.use(vuetify)
})
