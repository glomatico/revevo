export const useArtist = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const { loadSettings, settings } = useSettings();

  const loadingStateGeneral = ref<LoadingState>(LoadingState.IDLE);
  const loadingStateVideos = ref<LoadingState>(LoadingState.IDLE);
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

    const artistsResponse: ArtistResponse = await response.json();
    const artists = artistsResponse?.data?.artists;

    if (!artists) {
      throw new Error(`Error when fetching artists: ${response.status} ${response.statusText}`);
    }

    return artists;
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

    const artistsResponse: ArtistResponse = await response.json();
    const artists = artistsResponse?.data?.artists;

    if (!artists) {
      throw new Error(`Error when fetching artists videos: ${response.status} ${response.statusText}`);
    }

    return artists;
  };

  const filterArtistVideos = (artistVideos: Video[]) => {
    filteredArtistVideos.value = artistVideos.filter(video => isVideoValid(video, settings.value.hidePseudoCountryIsrc));
  };

  const loadArtistPage = async () => {
    loadingStateVideos.value = LoadingState.LOADING;

    try {
      const artistsVideosResponse = await getArtistsVideos(artistId.value!, page.value);

      const artistVideos = artistsVideosResponse[0]!.videoData.videos.data;
      filterArtistVideos(artistVideos);
    } catch (error) {
      console.error(error);
      loadingStateVideos.value = LoadingState.ERROR;
    }

    loadingStateVideos.value = LoadingState.LOADED;
  };

  const loadArtist = async () => {
    loadSettings();

    loadingStateGeneral.value = LoadingState.LOADING;

    try {
      const artistsResponse = await getArtists(artistId.value!, page.value);

      artist.value = (artistsResponse?.length == 1 ? artistsResponse[0] : null)!;
      validArtist.value = isArtistValid(artist.value);
      if (validArtist.value && artist.value?.videoData?.videos?.data) {
        filterArtistVideos(artist.value.videoData.videos.data);
      }
    } catch (error) {
      console.error(error);
      loadingStateGeneral.value = LoadingState.ERROR;
    }

    loadingStateGeneral.value = LoadingState.LOADED;
    loadingStateVideos.value = LoadingState.LOADED;
  };

  return {
    loadArtist,
    loadArtistPage,
    loadingStateGeneral,
    loadingStateVideos,
    page,
    artistId,
    artist,
    validArtist,
    filteredArtistVideos,
  };
};
