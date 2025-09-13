export const useSearch = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const { loadSettings, settings } = useSettings();

  const loadingStateGeneral = ref<LoadingState>(LoadingState.IDLE);
  const loadingStateResults = ref<LoadingState>(LoadingState.IDLE);
  const searchQuery = ref<string>();
  const searchOffset = ref<number>();
  const searchResults = ref<SearchResult>();
  const pageCount = ref<number>();
  const filteredVideoSerchResults = ref<Video[]>();
  const filteredArtistSerchResults = ref<Artist[]>();


  const getSearchResults = async (
    searchQuery: string,
    offsetArtists: number = 0,
    offsetVideos: number = 0,
    limit: number = 32,
  ): Promise<SearchResult> => {
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
      search: searchQuery,
      limit,
      offsetArtists,
      offsetVideos,
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
    const searchResultsResponse: SearchResultResponse = await response.json();
    const searchResults: SearchResult = searchResultsResponse?.data?.search;

    if (!searchResults) {
      throw new Error(`Error when fetching search results: ${response.status} ${response.statusText}`);
    }

    return searchResults;
  };

  const filterSearchResults = (searchResultsResponse: SearchResult) => {
    filteredVideoSerchResults.value = searchResultsResponse.videos.items
      .filter(video => isVideoValid(video, settings.value.hidePseudoCountryIsrc));
    filteredArtistSerchResults.value = searchResultsResponse.artists.items
      .filter(artist => isArtistValid(artist));
  };

  const loadSearchPage = async () => {
    loadingStateResults.value = LoadingState.LOADING;

    try {
      const searchResultsResponse = await getSearchResults(searchQuery.value!, searchOffset.value, searchOffset.value);

      const totalVideos = searchResultsResponse.videos.total;
      const totalArtists = searchResultsResponse.artists.total;
      pageCount.value = Math.ceil(Math.max(totalVideos, totalArtists) / 32);
      filterSearchResults(searchResultsResponse);
    } catch (error) {
      console.error(error);
      loadingStateResults.value = LoadingState.ERROR;
    }

    loadingStateResults.value = LoadingState.LOADED;
  };

  const loadSearch = async () => {
    loadSettings();

    loadingStateGeneral.value = LoadingState.LOADING;

    try {
      const searchResultsResponse = await getSearchResults(searchQuery.value!, searchOffset.value, searchOffset.value);

      searchResults.value = searchResultsResponse;
      filterSearchResults(searchResultsResponse);
    } catch (error) {
      console.error(error);
      loadingStateGeneral.value = LoadingState.ERROR;
    }

    loadingStateGeneral.value = LoadingState.LOADED;
    loadingStateResults.value = LoadingState.LOADED;
  };

  return {
    loadSearch,
    loadSearchPage,
    loadingStateGeneral,
    loadingStateResults,
    searchQuery,
    searchOffset,
    searchResults,
    pageCount,
    filteredVideoSerchResults,
    filteredArtistSerchResults,
  };
};
