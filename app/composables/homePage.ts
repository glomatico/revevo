export const useHomePage = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const loadingState = ref<LoadingState>(LoadingState.LOADING);
  const homePage = ref<HomePage | null>();
  const topVideosSection = ref<HomePageContainer | null>();
  const trendingArtistsSection = ref<HomePageContainer | null>();
  const filteredTopVideosSectionItems = ref<Video[]>();
  const filteredTrendingArtistsSectionItems = ref<Artist[]>();

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
                      genres
                    }
                    likes
                  }
                }
                ... on UnionPlaylistType {
                  playlist {
                    id
                    basicMeta {
                      title
                      description
                      videoCount
                    }
                    likes
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
        'Authorization': `Bearer ${useCookie<string | null>('token').value}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Error when fetching homepage: ${response.status} ${response.statusText}`);
    }

    const homePageRespons: HomePageResponse = await response.json();

    if (!homePageRespons.data?.homePage) {
      throw new Error('Invalid response structure: missing homepage data');
    }

    return homePageRespons.data.homePage;
  };

  const fetchHomePage = async () => {
    try {
      homePage.value = await getHomePage();
    } catch (error) {
      console.error(error);
      loadingState.value = LoadingState.ERROR;
    }
    loadingState.value = LoadingState.LOADED;
  };

  const loadHomePageVideoSection = () => {
    topVideosSection.value = homePage.value!.containersV2.find(s => s.serviceName === 'top-videos') || null;

    filteredTopVideosSectionItems.value = topVideosSection.value!.items.map(i => i.item?.video!).filter(v => isVideoValid(v, false));
  };

  const loadHomePageArtistSection = () => {
    trendingArtistsSection.value = homePage.value!.containersV2.find(s => s.serviceName === 'trending-artists') || null;

    filteredTrendingArtistsSectionItems.value = trendingArtistsSection.value!.items.map(i => i.item?.artist!).filter(a => isArtistValid(a));
  };


  const loadHomePage = async () => {
    await fetchHomePage();
    loadHomePageVideoSection();
    loadHomePageArtistSection();
  };

  return {
    loadHomePage,
    loadingState,
    homePage,
    topVideosSection,
    trendingArtistsSection,
    filteredTopVideosSectionItems,
    filteredTrendingArtistsSectionItems,
  };
}
