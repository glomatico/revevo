export const useCaptions = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;
  const token = config.public.apiToken;
  const captionsApiUrl = `${baseUrl}/captions`;

  const getCaptions = async (videoId: string): Promise<string | null> => {
    try {
      const response = await fetch(`${captionsApiUrl}/${videoId}?token=${token}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error fetching captions: ${response.statusText}`);
      }

      const data = await response.text();
      return data || null;
    } catch (err) {
      console.error('Failed to fetch captions:', err);
      return null;
    }
  }

  return {
    getCaptions,
  };
}
