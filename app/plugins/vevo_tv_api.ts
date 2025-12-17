import { VevoTvApi } from "~/lib/vevo_tv_api/api";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const vevoTvApiToken = config.public.vevoTvApiToken;

    const vevoTvApi = new VevoTvApi(vevoTvApiToken as string);

    return {
        provide: {
            vevoTvApi,
        },
    };
})
