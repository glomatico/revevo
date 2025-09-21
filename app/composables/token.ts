export const useToken = () => {
  const config = useRuntimeConfig();
  const tokenApiUrl = config.public.tokenApiUrl;

  const getTokenData = async (): Promise<TokenData> => {
    const jsonBody = {
      "client_id": "SPupX1tvqFEopQ1YS6SS",
      "grant_type": "urn:vevo:params:oauth:grant-type:anonymous",
    };

    const response = await fetch(tokenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonBody),
    });

    raiseForStatus(response);

    const tokenData: TokenData = await response.json();

    return tokenData;
  };

  const getTokenCookie = async (): Promise<string | null> => {
    const tokenCookie = useCookie(
      'token', { default: () => null }
    );
    return tokenCookie.value;
  };

  const setTokenCookie = async (tokenData: TokenData): Promise<void> => {
    const tokenCookie = useCookie(
      'token', { maxAge: tokenData.expires_in }
    );
    tokenCookie.value = tokenData.access_token;
  };

  const setupToken = async (): Promise<void> => {
    const tokenCookie = await getTokenCookie();
    if (!tokenCookie) {
      const tokenData = await getTokenData();
      if (tokenData.access_token) {
        await setTokenCookie(tokenData);
      } else {
        throw new Error('Failed to retrieve access token');
      }
    }
  };

  return { setupToken };
};
