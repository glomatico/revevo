import type { VideoResponse } from ".";

export const useVideo = () => {
  const config = useRuntimeConfig();
  const baseUrl = config.public.apiBaseUrl;
  const token = config.public.apiToken;
  const graphqlApiUrl = `${baseUrl}/graphql`;
  const captionsApiUrl = `${baseUrl}/captions`;

  const getVideo = async (
    id: string,
  ): Promise<Video | null> => {
    const query = `
      query GetVideo($id: String!) {
        video(id: $id) {
          id
          title
          thumbnail
          genre
          artists {
            role
            artist {
              id
              name
              thumbnail
            }
          }
          explicit
          lyricVideo
          hls
          dash
          mp4 {
            quality
            url
          }
          created
          duration
          copyright
          copyrightYear
          label
          viewCounts {
            total
          }
        }
      }
    `;

    const variables = {
      id,
    };

    try {
      const response = await fetch(graphqlApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables,
        })
      });

      if (!response.ok) {
        console.error('Error when fetching video:', response.statusText);
        return null;
      }

      const result: VideoResponse = await response.json();
      return result.data.video;
    } catch (err) {
      console.error('Exception when video:', err);
      return null;
    }
  };

  const getCaptions = async (videoId: string): Promise<string | null> => {
    try {
      const response = await fetch(`${captionsApiUrl}/${videoId}.vtt?token=${token}`, {
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
  }

  return {
    getVideo,
    getCaptions,
  };
}
