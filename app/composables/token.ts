export const useToken = () => {
  const config = useRuntimeConfig();
  const tokenApiUrl = config.public.tokenApiUrl;

  const getTokenData = async (): Promise<TokenData | null> => {
    const jsonBody = {
      "client_id": "SPupX1tvqFEopQ1YS6SS",
      "grant_type": "urn:vevo:params:oauth:grant-type:anonymous",
    };

    try {
      const response = await fetch(tokenApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonBody),
      });

      if (!response.ok) {
        console.error('Error fetching token:', response.statusText);
        return null;
      }

      const tokenData: TokenData = await response.json();
      return tokenData;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  };

  const getStoredToken = async (): Promise<string | null> => {
    const tokenCookie = useCookie<string | null>('token', {
      default: () => null
    });
    return tokenCookie.value;
  };

  const storeToken = async (tokenData: TokenData): Promise<void> => {
    const tokenCookie = useCookie<string | null>('token', {
      maxAge: tokenData.expires_in,
    });
    tokenCookie.value = tokenData.access_token;
  }

  return { getTokenData, getStoredToken, storeToken };
};
