export const useSearch = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const search = async (
    searchTerm: string,
    offsetArtists: number = 0,
    offsetVideos: number = 0,
    limit: number = 32,
  ): Promise<SearchResult | null> => {
    const query = `
      query Search($search: String!, $limit: Int, $offsetArtists: Int, $offsetVideos: Int) {
        search {
          artists(search: $search, limit: $limit, offset: $offsetArtists) {
            items {
              id
              basicMeta {
                name
                urlSafeName
                thumbnailUrl
              }
            }
            total
          }
          videos(search: $search, limit: $limit, offset: $offsetVideos) {
            items {
              basicMetaV3 {
                isrc
                title
                thumbnailUrl
                duration
                explicit
                artists {
                  basicMeta {
                    name
                    urlSafeName
                    role
                  }
                }
              }
              views {
                viewsTotal
              }
            }
            total
          }
        }
      }
    `
    const variables = {
      search: searchTerm,
      limit,
      offsetArtists,
      offsetVideos,
    };

    try {
      const response = await fetch(graphqlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useCookie<string | null>('token').value}`,
        },
        body: JSON.stringify({
          query,
          variables,
        })
      });

      if (!response.ok) {
        console.error('Search API response not ok:', response.statusText);
        return null;
      }

      const searchResultResponse: SearchResultResponse = await response.json();
      return searchResultResponse.data?.search || null;
    } catch (error) {
      console.error('Error during search API call:', error);
      return null;
    }
  }

  return { search };
};
