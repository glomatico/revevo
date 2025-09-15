export const useVideo = () => {
  const route = useRoute();
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;

  const { loadSettings, settings } = useSettings();

  const loadingState = ref<LoadingState>(LoadingState.IDLE);
  const videoId = ref<string>();
  const video = ref<Video>();
  const validVideo = ref<boolean>();
  const streamUrl = ref<string>();
  const captionsUrl = ref<string>();
  const filteredRelatedVideos = ref<Video[]>();


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

  const getBestMp4Stream = (): string | null => {
    const streams = video.value!.streamsV3!;

    const qualityPriority = ['high', 'medium', 'low'];

    const mp4Streams = streams.filter(stream =>
      stream.format === 'mp4' && stream.url
    );

    for (const quality of qualityPriority) {
      const stream = mp4Streams.find(s => s.quality === quality);
      if (stream) return stream.url;
    }

    return null;
  };

  const loadStreamUrl = () => {
    if (settings.value.playbackMethod === PlaybackMethod.HLS) {
      streamUrl.value = video.value!.streamsV3.find(s => s.format === 'hls')!.url;
    }
    if (settings.value.playbackMethod === PlaybackMethod.MP4) {
      streamUrl.value = getBestMp4Stream()!;
    }

    if (streamUrl.value) {
      streamUrl.value = streamUrl.value.replace('http://', 'https://');
    }
  };

  const loadCaptionsUrl = () => {
    captionsUrl.value = `/api/captions/${videoId.value!}`;
  };

  const filterRelatedVideos = () => {
    if (!video.value?.relatedVideos?.data) return;

    filteredRelatedVideos.value = video.value.relatedVideos.data;
    filteredRelatedVideos.value = filteredRelatedVideos.value.filter(
      v =>
        isVideoValid(v, settings.value.hidePseudoCountryIsrc)
        &&
        (v?.basicMetaV3?.isrc !== video.value?.basicMetaV3?.isrc)
    );
  };

  const loadVideo = async () => {
    loadSettings();

    loadingState.value = LoadingState.LOADING;

    try {
      const videosResponse = await getVideos(videoId.value!);

      video.value = (videosResponse.data?.length == 1 ? videosResponse.data[0] : null)!;
      validVideo.value = isVideoValid(video.value, false, true);
      filterRelatedVideos();

      if (validVideo.value) {
        loadStreamUrl();
        loadCaptionsUrl();
      }
    } catch (error) {
      console.error(error);
      loadingState.value = LoadingState.ERROR;
    }

    loadingState.value = LoadingState.LOADED;
  };

  onMounted(async () => {
    watch(route, async () => {
      videoId.value = route.params.id as string;
      await loadVideo();
    }, { immediate: true });
  });

  return {
    loadVideo,
    loadingState,
    video,
    validVideo,
    streamUrl,
    captionsUrl,
    filteredRelatedVideos,
  };
}
