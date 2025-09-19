export const useVideo = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const { loadSettings, settings } = useSettings();

  const loadingState = ref(LoadingState.IDLE);
  const videoId = ref('');
  const video = ref({} as Video);
  const validVideo = computed(() => isVideoValid(video.value, false, true));
  const streamUrl = ref('');
  const captionsUrl = computed(() => `/api/captions/${videoId.value}`);
  const filteredRelatedVideos = computed(
    () => video.value?.relatedVideos?.data?.filter(
      v => isVideoValid(v, settings.value.hidePseudoCountryIsrc)
    )
  );

  const getVideos = async (
    videoIds: string[] | string,
    relatedVideosPage: number = 1,
    relatedVideosSize: number = 32,
  ): Promise<VideoList> => {
    const query = `
      query Video($videoIds: [String]!, $relatedVideosPage: Int, $relatedVideosSize: Int) {
        videos(ids: $videoIds) {
          data {
            id
            basicMetaV3 {
              isrc
              title
              releaseDate
              copyright
              credits {
                role
                name
              }
              genres
              thumbnailUrl
              duration
              explicit
              artists {
                id
                basicMeta {
                  name
                  thumbnailUrl
                  urlSafeName
                }
              }
              categories
            }
            streamsV3 {
              format
              quality
              url
            }
            relatedVideos(size: $relatedVideosSize, page: $relatedVideosPage) {
              data {
                basicMetaV3 {
                  title
                  isrc
                  explicit
                  thumbnailUrl
                  duration
                  artists {
                    basicMeta {
                      name
                      urlSafeName
                      thumbnailUrl
                      role
                    }
                  }
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
            views {
              viewsTotal
              youTubeId
            }
          }
        }
      }
    `;

    const variables = {
      videoIds: Array.isArray(videoIds) ? videoIds : [videoIds],
      relatedVideosPage,
      relatedVideosSize,
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

    const videosResponse: VideoResponse = await response.json();
    const videos: VideoList = videosResponse?.data?.videos;

    if (!videos) {
      throw new Error('Invalid response structure: missing videos data');
    }

    return videos;
  };

  const getBestMp4Stream = (): string => {
    const streams = video.value!.streamsV3!;

    const qualityPriority = ['high', 'medium', 'low'];

    const mp4Streams = streams.filter(stream =>
      stream.format === 'mp4' && stream.url
    );

    for (const quality of qualityPriority) {
      const stream = mp4Streams.find(s => s.quality === quality);
      if (stream) return stream.url;
    }

    return '';
  };

  const loadStreamUrl = () => {
    if (settings.value.playbackMethod === PlaybackMethod.MP4) {
      streamUrl.value = getBestMp4Stream()!;
    }
    else {
      streamUrl.value = video.value!.streamsV3.find(s => s.format === 'hls')!.url;
    }

    if (streamUrl.value) {
      streamUrl.value = streamUrl.value.replace('http://', 'https://');
    }
  };

  const loadVideo = async () => {
    loadSettings();

    loadingState.value = LoadingState.LOADING;

    try {
      const videosResponse = await getVideos(videoId.value!);

      video.value = videosResponse.data[0]!;
      if (validVideo.value) {
        loadStreamUrl();
      }

      loadingState.value = LoadingState.LOADED;
    } catch (error) {
      console.error(error);
      loadingState.value = LoadingState.ERROR;
    }
  };

  return {
    loadVideo,
    loadingState,
    videoId,
    video,
    validVideo,
    streamUrl,
    captionsUrl,
    filteredRelatedVideos,
  };
}
