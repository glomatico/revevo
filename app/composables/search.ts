export const useSearch = () => {
  const config = useRuntimeConfig();
  const token = config.public.apiToken;
  const baseUrl = config.public.apiBaseUrl;
  const graphqlApiUrl = `${baseUrl}/graphql`;

  const searchVideos = async (
    query: string,
    explicit: boolean = false,
    offset: number = 0,
    limit: number = 25,
  ): Promise<VideoSearchResult | null> => {
    const graphqlQuery = `
      query SearchVideos($query: String!, $explicit: Boolean, $offset: Int, $limit: Int) {
        videoSearch(query: $query, explicit: $explicit, offset: $offset, limit: $limit) {
          itemsCount
          items {
            id
            title
            thumbnail
            duration
            explicit
            artists {
              role
              artist {
                id
                name
                thumbnail
              }
            }
            viewCounts {
              total
            }
          }
        }
      }
    `; // <-- Make sure this is closed

    const variables = {
      query,
      explicit,
      offset,
      limit,
    };

    try {
      const response = await fetch(graphqlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: graphqlQuery, // <-- Use "query" not "graphqlQuery"
          variables,
        })
      });

      if (!response.ok) {
        console.error('Error when searching videos:', response.statusText);
        return null;
      }

      const result: VideoSearchResultResponse = await response.json();
      return result.data.videoSearch;
    } catch (err) {
      console.error('Exception when fetching search results:', err);
      return null;
    }
  }

  return { searchVideos };
};
