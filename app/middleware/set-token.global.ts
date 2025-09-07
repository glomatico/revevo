export default defineNuxtRouteMiddleware(async (to, from) => {
    const { getTokenData, getStoredToken, storeToken } = useToken();

    try {
        const tokenCookie = await getStoredToken();
        if (!tokenCookie) {
            const tokenData = await getTokenData();
            if (tokenData) {
                await storeToken(tokenData);
            } else {
                console.error('Failed to obtain authentication token');
                throw createError({
                    statusCode: 503,
                    statusMessage: 'Service temporarily unavailable. Please try again later.'
                });
            }
        }
    } catch (error) {
        console.error('Token middleware error:', error);
        if (to.path !== '/') {
            return navigateTo('/');
        }
        throw error;
    }
})
