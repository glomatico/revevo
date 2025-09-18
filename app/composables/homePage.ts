export const useHomePage = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const { loadSettings, settings } = useSettings();

  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const homePage = ref<HomePage>();
  const topVideosSection = ref<HomePageContainer>();
  const trendingArtistsSection = ref<HomePageContainer>();
  const playlistsSection = ref<HomePageContainer>();
  const filteredTopVideosSectionItems = ref<Video[]>();
  const filteredTrendingArtistsSectionItems = ref<Artist[]>();
  const filteredPlaylistsSectionItems = ref<Playlist[]>();

  const getHomePage = async (
    offset: number = 0,
    limit: number = 20,
    timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
  ): Promise<HomePage> => {
    const query = `
      query HomePage($timeZone: String, $offset: Int, $limit: Int) {
        homePage {
          title
          description
          generatedDate
          containersV2(time_zone: $timeZone) {
            id
            title
            description
            type
            thumbnail
            render
            target
            serviceName
            items(offset: $offset, limit: $limit) {
              title
              description
              thumbnail
              target
              type
              item {
                ... on UnionVideoType {
                  video {
                    id
                    basicMetaV3 {
                      title
                      isrc
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
                    likes
                    views {
                      viewsTotal
                    }
                  }
                }
                ... on UnionArtistType {
                  artist {
                    id
                    basicMeta {
                      name
                      thumbnailUrl
                      urlSafeName
                    }
                    likes
                  }
                }
                ... on UnionPlaylistType {
                  playlist {
                    id
                    basicMeta {
                      title
                      image_url
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const variables = {
      timeZone,
      offset,
      limit,
    };

    const response = await fetch(graphqlApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${useCookie('token').value}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Error when fetching homepage: ${response.status} ${response.statusText}`);
    }

    const homePageResponse: HomePageResponse = await response.json();
    const homePage: HomePage = homePageResponse?.data?.homePage;

    if (!homePage) {
      throw new Error(`Error when fetching homepage: ${response.status} ${response.statusText}`);
    }

    return homePage;
  };

  const loadHomePageVideoSection = () => {
    topVideosSection.value = homePage.value!.containersV2.find(s => s.serviceName === 'top-videos');

    filteredTopVideosSectionItems.value = topVideosSection.value!.items.map(i => i.item.video).filter(v => isVideoValid(v, settings.value.hidePseudoCountryIsrc));
  };

  const loadHomePageArtistSection = () => {
    trendingArtistsSection.value = homePage.value!.containersV2.find(s => s.serviceName === 'trending-artists');

    filteredTrendingArtistsSectionItems.value = trendingArtistsSection.value!.items.map(i => i.item.artist).filter(a => isArtistValid(a));
  };

  const loadHomePagePlaylistSection = () => {
    playlistsSection.value = homePage.value!.containersV2.find(s => s.serviceName === 'playlists');

    filteredPlaylistsSectionItems.value = playlistsSection.value?.items.map(i => i.item.playlist)
  };


  const loadHomePage = async () => {
    loadSettings();

    loadingState.value = LoadingState.LOADING;

    try {
      homePage.value = await getHomePage();

      loadHomePageVideoSection();
      loadHomePageArtistSection();
      loadHomePagePlaylistSection();
    } catch (error) {
      console.error(error);
      loadingState.value = LoadingState.ERROR;
    }

    loadingState.value = LoadingState.LOADED;
  };

  return {
    loadHomePage,
    loadingState,
    homePage,
    topVideosSection,
    trendingArtistsSection,
    playlistsSection,
    filteredTopVideosSectionItems,
    filteredTrendingArtistsSectionItems,
    filteredPlaylistsSectionItems,
  };
}
