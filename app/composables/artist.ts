export const useArtist = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;
  const token = useCookie<string | null>('token').value;

  const getArtists = async (
    artistIds: string[] | string,
    videosPage: number = 1,
    videosSize: number = 32,
    videosSort: string = "viewsTotal",
  ): Promise<Artist[] | null> => {
    const query = `
      query Artist($artistIds: [String]!, $videosSize: Int, $videosPage: Int, $videosSort: String) {
        artists(ids: $artistIds) {
          basicMeta {
            name
            thumbnailUrl
            genres
            bio {
              text
              source
              birthCity
              birthName
              origin
              dateOfBirth
            }
            links {
              type
              url
            }
            views {
              viewsTotal
            }
          }
          videoData(size: $videosSize, page: $videosPage, sort: $videosSort) {
            videos {
              data {
                id
                basicMetaV3 {
                  title
                  thumbnailUrl
                  duration
                  explicit
                }
                basicMeta {
                  duration
                }
                views {
                  viewsTotal
                }
              }
              paging {
                total
                pages
              }
            }
          }
          relatedArtists {
            name
            urlSafeName
            thumbnailUrl
          }
        }
      }
    `;

    const variables = {
      artistIds: Array.isArray(artistIds) ? artistIds : [artistIds],
      videosSize,
      videosPage,
      videosSort,
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
      return result.data!.artists;
    } catch (err) {
      console.error('Exception when fetching artists:', err);
      return null;
    }
  };

  const getArtistsVideos = async (
    artistIds: string[] | string,
    videosPage: number = 1,
    videosSize: number = 32,
    videosSort: string = "viewsTotal",
  ): Promise<Artist[] | null> => {
    const query = `
      query Artist($artistIds: [String]!, $videosSize: Int, $videosPage: Int, $videosSort: String) {
        artists(ids: $artistIds) {
          videoData(size: $videosSize, page: $videosPage, sort: $videosSort) {
            videos {
              data {
                id
                basicMetaV3 {
                  title
                  thumbnailUrl
                  duration
                  explicit
                }
                basicMeta {
                  duration
                }
                views {
                  viewsTotal
                }
              }
              paging {
                total
                pages
              }
            }
          }
        }
      }
    `;

    const variables = {
      artistIds: Array.isArray(artistIds) ? artistIds : [artistIds],
      videosSize,
      videosPage,
      videosSort,
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
        console.error('Error when fetching artists videos:', response.statusText);
        return null;
      }

      const result: ArtistResponse = await response.json();
      return result.data!.artists;
    } catch (err) {
      console.error('Exception when fetching artists videos:', err);
      return null;
    }
  };

  return {
    getArtists,
    getArtistsVideos,
  };
};
