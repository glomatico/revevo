export const useSearch = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;
  const searchTerm = ref<string | null>(null);
  const hidePseudoCountryIsrc = ref<boolean>();
  const loadingStateGeneral = ref<LoadingState>(LoadingState.LOADING);
  const loadingStateResults = ref<LoadingState>(LoadingState.LOADING);
  const searchOffset = ref<number>(0);
  const searchResults = ref<SearchResult | null>();
  const filteredVideoSerchResults = ref<Video[] | null>();
  const filteredArtistSerchResults = ref<Artist[] | null>();
  const searchResultCount = ref<number>(0);


  const search = async (
    searchTerm: string,
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
      search: searchTerm,
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

    if (!response.ok) {
      throw new Error(`Error when searching: ${response.status} ${response.statusText}`);
    }

    const searchResultResponse: SearchResultResponse = await response.json();

    if (!searchResultResponse.data?.search) {
      throw new Error('Invalid response structure: missing search data');
    }

    return searchResultResponse.data.search;
  }

  const loadSearch = async () => {
    loadingStateResults.value = LoadingState.LOADING;

    try {
      searchResults.value = await search(searchTerm.value!, searchOffset.value, searchOffset.value);

      filteredVideoSerchResults.value = searchResults.value.videos.items
        .filter(video => isVideoValid(video, false, hidePseudoCountryIsrc.value));
      filteredArtistSerchResults.value = searchResults.value.artists.items
        .filter(artist => isArtistValid(artist));

      searchResultCount.value = Math.max(
        searchResults.value.artists.total || 0,
        searchResults.value.videos.total || 0,
      );
    } catch (error) {
      console.error(error);

      if (loadingStateGeneral.value === LoadingState.LOADING) {
        loadingStateGeneral.value = LoadingState.ERROR;
      }
      loadingStateResults.value = LoadingState.ERROR;
    }

    loadingStateGeneral.value = LoadingState.LOADED;
    loadingStateResults.value = LoadingState.LOADED;
  };

  return {
    loadSearch,
    hidePseudoCountryIsrc,
    searchTerm,
    loadingStateGeneral,
    loadingStateResults,
    searchOffset,
    searchResults,
    filteredVideoSerchResults,
    filteredArtistSerchResults,
  };
};
