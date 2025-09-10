import Hls from 'hls.js';
import type { StreamsV3 } from '.';

export const useVideo = () => {
  const config = useRuntimeConfig();
  const graphqlApiUrl = config.public.graphqlApiUrl;
  const captionsApiUrl = config.public.captionsApiUrl;
  const captionsApiToken = config.public.captionsToken;

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

    if (!response.ok) {
      throw new Error(`Error when fetching videos: ${response.status} ${response.statusText}`);
    }

    const result: VideoResponse = await response.json();

    if (!result.data?.videos) {
      throw new Error('Invalid response structure: missing videos data');
    }

    return result.data.videos;
  };

  const getCaptions = async (videoId?: string): Promise<string> => {
    const response = await fetch(`${captionsApiUrl}/${videoId}.vtt?token=${captionsApiToken}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Error fetching captions: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();

    if (!data) {
      throw new Error('Invalid response structure: missing captions data');
    }

    return data;
  };

  const getBestMp4Stream = (streams: StreamsV3[]): string | null => {
    const qualityPriority = ['high', 'medium', 'low'] as const;

    const mp4Streams = streams.filter(stream =>
      stream.format === 'mp4' && stream.url
    );

    for (const quality of qualityPriority) {
      const stream = mp4Streams.find(s => s.quality === quality);
      if (stream) return stream.url;
    }

    return null;
  }

  const isVideoValid = (video: Video | null, checkStreams: boolean = true): boolean => {
    return Boolean(
      video?.basicMetaV3?.title
      &&
      (checkStreams ? video?.streamsV3?.some(stream => stream.url) : true)
    );
  }

  const attachCaptions = async (videoHtml: HTMLVideoElement, captionsVtt?: string) => {
    if (!captionsVtt) return;

    const response = await fetch(captionsVtt);
    if (!response.ok) return;

    const blob = new Blob([await response.text()], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);

    const track = document.createElement('track') as HTMLTrackElement;

    track.kind = 'subtitles';
    track.label = 'Unknown Language';
    track.src = url;
    track.default = false;

    videoHtml.textTracks.addEventListener('change', () => {
      const tracks = videoHtml.textTracks;

      Array.from(tracks).forEach((track) => {
        if (track.kind !== 'subtitles') return;
        localStorage.setItem('enableCaptions', (track.mode === 'showing').toString());
      });
    });

    videoHtml.appendChild(track);

    toggleCaptionsFromStorage(videoHtml);
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

  const attachHlsVideo = async (videoHtml: HTMLVideoElement, streamUrl?: string) => {
    if (!streamUrl) return;

    const hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(videoHtml);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      videoHtml.play();
    });
  }

  const attachNormalVideo = async (videoHtml: HTMLVideoElement, streamUrl?: string) => {
    if (!streamUrl) return;

    videoHtml.src = streamUrl;
    videoHtml.play();
  }

  return {
    getVideos,
    isVideoValid,
    getCaptions,
    getBestMp4Stream,
    attachHlsVideo,
    attachNormalVideo,
    attachCaptions,
  };
}
