export const usePlaylist = (setupWatcher?: boolean) => {
  const route = useRoute();
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const loadingStateGeneral = ref<LoadingState>(LoadingState.IDLE);
  const loadingStatePage = ref<LoadingState>(LoadingState.IDLE);
  const offset = ref<number>(0);
  const playlistId = ref<string>();
  const playlistIndex = computed<number>(() =>
    parseInt(route.query.i as string || '0')
  );
  const playlist = ref<Playlist>();
  const validPlaylist = ref<boolean>();
  const filteredPlaylistVideos = computed<Video[]>(() =>
    playlist.value?.videos.items
      .map(item => item.videoData)
      .filter(video => isVideoValid(video))!
  );


  const getPlaylists = async (
    playlistId: string,
    offset: number = 0,
    limit: number = 32,
  ): Promise<Playlist[]> => {
    const query = `
      query GetPlaylist($playlistId: String!, $limit: Int, $offset: Int) {
        playlists(ids: [$playlistId]) {
          id
          playlistId
          basicMeta {
            title
            description
            image_url
            curated
            videoCount
          }
          videos(limit: $limit, offset: $offset) {
            items {
              id
              videoData {
                basicMetaV3 {
                  title
                  isrc
                  thumbnailUrl
                  duration
                  explicit
                  artists {
                    id
                    basicMeta {
                      urlSafeName
                      name
                    }
                  }
                }
                likes
                views {
                  viewsTotal
                  viewsLast30Days
                }
              }
            }
            playlistId
            offset
            limit
          }
        }
      }
    `;

    const variables = {
      playlistId,
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
      throw new Error(`Error when fetching playlist: ${response.status} ${response.statusText}`);
    }

    const playlistResponse: PlaylistResponse = await response.json();
    const playlists: Playlist[] = playlistResponse?.data?.playlists;

    if (!playlists) {
      throw new Error(`Playlist with ID ${playlistId} not found.`);
    }

    return playlists;
  };

  const getPlaylistsPage = async (
    playlistId: string,
    offset: number = 0,
    limit: number = 32,
  ): Promise<Playlist[]> => {
    const query = `
      query GetPlaylist($playlistId: String!, $limit: Int, $offset: Int) {
        playlists(ids: [$playlistId]) {
          videos(limit: $limit, offset: $offset) {
            items {
              id
              videoData {
                basicMetaV3 {
                  title
                  isrc
                  thumbnailUrl
                  duration
                  explicit
                  artists {
                    id
                    basicMeta {
                      urlSafeName
                      name
                    }
                  }
                }
                likes
                views {
                  viewsTotal
                  viewsLast30Days
                }
              }
            }
            playlistId
            offset
            limit
          }
        }
      }
    `;

    const variables = {
      playlistId,
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
      throw new Error(`Error when fetching playlis page: ${response.status} ${response.statusText}`);
    }

    const playlistResponse: PlaylistResponse = await response.json();
    const playlists: Playlist[] = playlistResponse?.data?.playlists;

    if (!playlists) {
      throw new Error(`Playlist with ID ${playlistId} not found.`);
    }

    return playlists;
  };

  const loadPlaylistPage = async () => {
    loadingStatePage.value = LoadingState.LOADING;

    try {
      offset.value!++;
      const playlistsPageResponse = await getPlaylistsPage(playlistId.value!, offset.value! * 32);
      if (playlist.value) {
        playlist.value.videos.items.push(
          ...playlistsPageResponse[0]!.videos.items
        );
      }
      loadingStatePage.value = LoadingState.LOADED;
    } catch (error) {
      console.error(error);
      loadingStatePage.value = LoadingState.ERROR;
    }
  };

  const loadPlaylist = async () => {
    loadingStateGeneral.value = LoadingState.LOADING;

    try {
      const playlistsResponse = await getPlaylists(playlistId.value!);

      playlist.value = (playlistsResponse?.length == 1 ? playlistsResponse[0] : null)!;
      validPlaylist.value = isPlaylistValid(playlist.value);

      loadingStateGeneral.value = LoadingState.LOADED;
      loadingStatePage.value = LoadingState.LOADED;
    } catch (error) {
      console.error(error);
      loadingStateGeneral.value = LoadingState.ERROR;
    }
  };

  onMounted(() => {
    if (!setupWatcher) return;

    watch(() => route.query.playlistId, (newPlaylistId) => {
      playlistId.value = newPlaylistId as string;
      loadPlaylist();
    }, { immediate: true });
  });


  return {
    loadPlaylistPage,
    setupWatcher,
    loadingStateGeneral,
    loadingStatePage,
    playlistId,
    playlistIndex,
    offset,
    playlist,
    validPlaylist,
    filteredPlaylistVideos,
  };
}
