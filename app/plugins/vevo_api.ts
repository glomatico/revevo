import { VevoApi } from "~/lib/vevo_api/api";

export default defineNuxtPlugin((nuxtApp) => {
    const vevoApi = new VevoApi();

    return {
        provide: {
            vevoApi,
        },
    };
})
