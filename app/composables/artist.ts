export const useArtist = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const getArtists = async (
    artistIds: string[] | string,
    videosPage: number = 1,
    videosSize: number = 32,
    videosSort: string = "viewsTotal",
  ): Promise<Artist[]> => {
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
                basicMetaV3 {
                  isrc
                  title
                  thumbnailUrl
                  releaseDate
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
      throw new Error(`Error when fetching artist: ${response.status} ${response.statusText}`);
    }

    const result: ArtistResponse = await response.json();

    if (!result.data?.artists) {
      throw new Error('Invalid response structure: missing artists data');
    }

    return result.data.artists;
  };

  const getArtistsVideos = async (
    artistIds: string[] | string,
    videosPage: number = 1,
    videosSize: number = 32,
    videosSort: string = "viewsTotal",
  ): Promise<Artist[]> => {
    const query = `
      query Artist($artistIds: [String]!, $videosSize: Int, $videosPage: Int, $videosSort: String) {
        artists(ids: $artistIds) {
          videoData(size: $videosSize, page: $videosPage, sort: $videosSort) {
            videos {
              data {
                basicMetaV3 {
                  isrc
                  title
                  releaseDate
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
      throw new Error(`Error when fetching artists videos: ${response.status} ${response.statusText}`);
    }

    const result: ArtistResponse = await response.json();

    if (!result.data?.artists) {
      throw new Error('Invalid response structure: missing artists data');
    }

    return result.data.artists;
  };

  const isArtistValid = (artist: Artist | null): boolean => {
    return Boolean(artist?.basicMeta?.name);
  }

  const artistHasVideos = (artist: Artist | null): boolean => {
    return Boolean(artist?.videoData?.videos?.data?.length);
  }

  return {
    getArtists,
    getArtistsVideos,
    isArtistValid,
    artistHasVideos,
  };
};
