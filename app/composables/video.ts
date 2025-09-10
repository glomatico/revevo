import Hls from 'hls.js';

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

  const attachCaptions = async (videoHtml: HTMLVideoElement, captionsVtt: string) => {
    if (!videoHtml || !captionsVtt) return;

    const response = await fetch(captionsVtt);
    if (!response.ok) return;

    const blob = new Blob([await response.text()], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);

    const track = document.createElement('track') as HTMLTrackElement;

    track.kind = 'subtitles';
    track.label = 'Unknown Language';
    track.src = url;
    track.default = true;

    videoHtml.appendChild(track);
  };

  const toggleCaptionsFromStorage = async (videoHtml: HTMLVideoElement) => {
    if (!videoHtml) return;

    const enableCaptions = localStorage.getItem('enableCaptions') === 'true';
    Array.from(videoHtml.textTracks).forEach((track) => {
      if (track.kind === 'subtitles') {
        track.mode = enableCaptions ? 'showing' : 'hidden';
      }
    });
  };

  const attachVideo = async (videoHtml: HTMLVideoElement, streamUrl: string) => {
    if (!videoHtml || !streamUrl) return;

    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(videoHtml);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      videoHtml.play();
    });

    videoHtml.textTracks.addEventListener('change', () => {
      const tracks = videoHtml.textTracks;

      Array.from(tracks).forEach((track) => {
        if (track.kind !== 'subtitles') return;
        localStorage.setItem('enableCaptions', (track.mode === 'showing').toString());
      });
    });

    toggleCaptionsFromStorage(videoHtml);
  }

  return {
    getVideos,
    getCaptions,
    attachVideo,
    attachCaptions,
  };
}
