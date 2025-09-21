export const usePlaylist = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const loadingStateGeneral = ref(LoadingState.IDLE);
  const loadingStateVideos = ref(LoadingState.IDLE);
  const playlistId = ref<string>('');
  const page = ref(1);
  const offset = computed(() => 32 * (page.value - 1));
  const playlist = ref<Playlist>({} as Playlist);
  const validPlaylist = computed<boolean>(() => isPlaylistValid(playlist.value));
  const filteredPlaylistVideos = computed<Video[]>(() =>
    playlist.value?.videos?.items
      ?.map(item => item.videoData)
      .filter(video => isVideoValid(video))
  );
  const isFullyLoaded = computed(() =>
    playlist.value?.videos?.items?.length >=
    playlist.value?.basicMeta?.videoCount
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
                      role
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

    const playlistResponse: PlaylistResponse = await response.json();
    const playlists: Playlist[] = playlistResponse?.data?.playlists;

    if (!playlists) {
      throw new Error(`Error when fetching playlists: ${response.status} ${response.statusText}`);
    }

    return playlists;
  };

  const getPlaylistsVideos = async (
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
                      role
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

    raiseForStatus(response);

    const playlistResponse: PlaylistResponse = await response.json();
    const playlists: Playlist[] = playlistResponse?.data?.playlists;

    if (!playlists) {
      throw new Error(`Error when fetching playlists videos: ${response.status} ${response.statusText}`);
    }

    return playlists;
  };

  const loadPlaylistVideos = async () => {
    if (isFullyLoaded.value) return;

    loadingStateVideos.value = LoadingState.LOADING;

    try {
      const fetchedPlaylistsVideos = await getPlaylistsVideos(playlistId.value!, offset.value);
      playlist.value.videos.items.push(
        ...fetchedPlaylistsVideos[0]!.videos.items
      );
      page.value++;
      loadingStateVideos.value = LoadingState.LOADED;
    } catch (error) {
      console.error(error);
      loadingStateVideos.value = LoadingState.ERROR;
    }
  };

  const loadPlaylist = async () => {
    loadingStateGeneral.value = LoadingState.LOADING;

    try {
      const fetchedPlaylists = await getPlaylists(playlistId.value)

      playlist.value = fetchedPlaylists[0]!;
      page.value++;

      loadingStateGeneral.value = LoadingState.LOADED;
      loadingStateVideos.value = LoadingState.LOADED;
    } catch (error) {
      console.error(error);
      loadingStateGeneral.value = LoadingState.ERROR;
    }
  };

  return {
    loadPlaylist,
    loadPlaylistVideos,
    loadingStateGeneral,
    loadingStateVideos,
    playlistId,
    page,
    playlist,
    validPlaylist,
    filteredPlaylistVideos,
    isFullyLoaded,
  };
}
