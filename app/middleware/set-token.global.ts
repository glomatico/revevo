export default defineNuxtRouteMiddleware(async (to, from) => {
    const { getTokenData, getStoredToken, storeToken } = useToken();

    const tokenCookie = await getStoredToken();
    if (!tokenCookie) {
        const tokenData = await getTokenData();
        if (tokenData) {
            await storeToken(tokenData);
        } else {
            return navigateTo('/error');
        }
    }
})
