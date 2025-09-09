export const useVideo = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;
  const captionsApiUrl = config.public.captionsApiUrl;
  const captionsApiToken = config.public.captionsToken;

  const getVideos = async (
    videoIds: string[] | string,
    relatedVideosPage: number = 1,
    relatedVideosSize: number = 32,
  ): Promise<VideoList | null> => {
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

    try {
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
        console.error('Error when fetching videos:', response.statusText);
        return null;
      }

      const result: VideoResponse = await response.json();
      return result.data!.videos;
    } catch (err) {
      console.error('Error when fetching videos:', err);
      return null;
    }
  };

  const getCaptions = async (videoId: string): Promise<string | null> => {
    try {
      const response = await fetch(`${captionsApiUrl}/${videoId}.vtt?token=${captionsApiToken}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Error fetching captions: ${response.statusText}`);
      }

      const data = await response.text();
      return data || null;
    } catch (err) {
      console.error('Failed to fetch captions:', err);
      return null;
    }
  };

  return {
    getVideos,
    getCaptions,
  };
}
