export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!import.meta.client) {
        return;
    }

    const { setupToken } = useToken();

    try {
        await setupToken();
    } catch (error) {
        console.error(error);
        throw createError({
            statusCode: 503,
            statusMessage: 'Service temporarily unavailable. Please try again later.'
        });
    }
})
