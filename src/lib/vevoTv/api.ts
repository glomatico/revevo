import { $fetch } from "ofetch";
import {
  DEFAULT_API_LIMIT,
  DEFAULT_TOKEN,
  QUERY_CONTINUOUS_PLAY,
  QUERY_GET_ARTIST,
  QUERY_GET_ARTIST_VIDEOS,
  QUERY_GET_CONTAINER,
  QUERY_GET_CONTAINER_VIDEOS,
  QUERY_GET_HOME,
  QUERY_GET_VIDEO,
  QUERY_SEARCH,
  VEVO_TV_API_BASE_URL,
} from "./constants";

export class VevoTvApi {
  constructor(private readonly token: string = DEFAULT_TOKEN) {}

  private async request(query: string, variables: any): Promise<any> {
    const response = (await $fetch(VEVO_TV_API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: {
        query,
        variables,
      },
    })) as any;
    if (response?.errors) {
      throw new Error(response.errors.message);
    }
    return response;
  }

  async getArtist(
    id: string,
    videosOffset = 0,
    videosLimit = DEFAULT_API_LIMIT,
    explicit = true,
  ): Promise<any> {
    return this.request(QUERY_GET_ARTIST, {
      id,
      videosLimit,
      videosOffset,
      explicit,
    });
  }

  async getArtistVideos(
    id: string,
    offset = 0,
    limit = DEFAULT_API_LIMIT,
    explicit = true,
  ): Promise<any> {
    return this.request(QUERY_GET_ARTIST_VIDEOS, {
      id,
      offset,
      limit,
      explicit,
    });
  }

  async getVideo(id: string): Promise<any> {
    return this.request(QUERY_GET_VIDEO, {
      id,
    });
  }

  async getContinuousPlay(
    videoId: string,
    offset = 0,
    limit = DEFAULT_API_LIMIT,
    explicit = true,
  ): Promise<any> {
    return this.request(QUERY_CONTINUOUS_PLAY, {
      videoId,
      offset,
      limit,
      explicit,
    });
  }

  async search(
    query: string,
    videosOffset = 0,
    videosLimit = DEFAULT_API_LIMIT,
    artistsOffset = 0,
    artistsLimit = DEFAULT_API_LIMIT,
    playlistsOffset = 0,
    playlistsLimit = DEFAULT_API_LIMIT,
    explicit = true,
  ): Promise<any> {
    return this.request(QUERY_SEARCH, {
      query,
      videosOffset,
      videosLimit,
      artistsOffset,
      artistsLimit,
      playlistsOffset,
      playlistsLimit,
      explicit,
    });
  }

  async getContainer(
    id: string,
    offset = 0,
    limit = DEFAULT_API_LIMIT,
    explicit = true,
  ): Promise<any> {
    return this.request(QUERY_GET_CONTAINER, {
      id,
      offset,
      limit,
      explicit,
    });
  }

  async getContainerVideos(
    id: string,
    offset = 0,
    limit = DEFAULT_API_LIMIT,
    explicit = true,
  ): Promise<any> {
    return this.request(QUERY_GET_CONTAINER_VIDEOS, {
      id,
      offset,
      limit,
      explicit,
    });
  }

  async getHome(limit = DEFAULT_API_LIMIT, explicit = true): Promise<any> {
    return this.request(QUERY_GET_HOME, {
      limit,
      explicit,
    });
  }
}
