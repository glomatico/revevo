export const useArtist = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;
  const token = config.public.apiToken;
  const graphqlApiUrl = `${baseUrl}/graphql`;

  const getArtist = async (
    id: string,
    videosOffset = 0,
    videosLimit = 32,
    explicit = true,
  ): Promise<Artist | null> => {
    const query = `
      query GetArtist($id: String!, $videosLimit: Int, $videosOffset: Int, $explicit: Boolean) {
        artist(id: $id) {
          id
          name
          thumbnail
          viewCounts {
            total
          }
          videos(limit: $videosLimit, offset: $videosOffset, explicit: $explicit) {
            itemsCount
            items {
              id
              title
              thumbnail
              explicit
              duration
              viewCounts {
                total
              }
              artists {
                role
                artist {
                  id
                  name
                  thumbnail
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      id,
      videosLimit,
      videosOffset,
      explicit,
    };

    try {
      const response = await fetch(graphqlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables,
        })
      });

      if (!response.ok) {
        console.error('Error when fetching artist:', response.statusText);
        return null;
      }

      const result: ArtistResponse = await response.json();
      return result.data.artist;
    } catch (err) {
      console.error('Exception when fetching artist:', err);
      return null;
    }
  };

  const getArtistVideography = async (
    id: string,
    offset = 0,
    limit = 32,
    explicit = true,
  ): Promise<ArtistVideos | null> => {
    const query = `
      query GetArtistVideos($id: String!, $limit: Int, $offset: Int, $explicit: Boolean) {
        artist(id: $id) {
          videos(limit: $limit, offset: $offset, explicit: $explicit) {
            itemsCount
            items {
              id
              title
              thumbnail
              explicit
              duration
              viewCounts {
                total
              }
              artists {
                role
                artist {
                  id
                  name
                  thumbnail
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      id,
      limit,
      offset,
      explicit,
    };

    try {
      const response = await fetch(graphqlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables,
        })
      });

      if (!response.ok) {
        console.error('Error when fetching artist videos:', response.statusText);
        return null;
      }

      const result: ArtistVideographyResponse = await response.json();
      return result.data.artist?.videos || null;
    } catch (err) {
      console.error('Exception when fetching artist videos:', err);
      return null;
    }
  };

  return {
    getArtist,
    getArtistVideos: getArtistVideography
  };
};
