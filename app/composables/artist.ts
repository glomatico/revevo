export const useArtist = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;
  const hidePseudoCountryIsrc = ref<boolean>();
  const loadingStateGeneral = ref<LoadingState>(LoadingState.LOADING);
  const loadingStateVideos = ref<LoadingState>(LoadingState.LOADING);
  const page = ref<number>();
  const artistId = ref<string | null>();
  const artist = ref<Artist | null>();
  const validArtist = ref<boolean>(false);
  const filteredArtistVideos = ref<Video[] | null>();

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

  const loadArtistVideos = async () => {
    loadingStateVideos.value = LoadingState.LOADING;

    try {
      const artistsVideos = await getArtistsVideos(artistId.value!, page.value);

      filteredArtistVideos.value = (artistsVideos ? artistsVideos[0] as Artist : null)
        ?.videoData?.videos?.data?.filter(video => isVideoValid(video, false, hidePseudoCountryIsrc.value));
    } catch (error) {
      console.error(error);
      loadingStateVideos.value = LoadingState.ERROR;
    }

    loadingStateVideos.value = LoadingState.LOADED;
  };

  const loadArtist = async () => {
    try {
      const artists = await getArtists(artistId.value!, page.value);

      artist.value = artists ? artists[0] : null;
      filteredArtistVideos.value = artist.value?.videoData?.videos?.data?.filter(video => isVideoValid(video, false, hidePseudoCountryIsrc.value));
    } catch (error) {
      console.error(error);
      loadingStateGeneral.value = LoadingState.ERROR;
    }

    loadingStateGeneral.value = LoadingState.LOADED;
    loadingStateVideos.value = LoadingState.LOADED;

    validArtist.value = isArtistValid(artist.value!);
  };

  return {
    loadArtist,
    loadArtistVideos,
    hidePseudoCountryIsrc,
    loadingStateGeneral,
    loadingStateVideos,
    page,
    artistId,
    artist,
    validArtist,
    filteredArtistVideos,
  };
};
