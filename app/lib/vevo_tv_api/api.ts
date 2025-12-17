import { QUERY_GET_ARTIST, VEVO_TV_API_BASE_URL, QUERY_GET_ARTIST_VIDEOS, QUERY_GET_VIDEO } from "./constants";

export class VevoTvApi {
    constructor(private readonly token: string) { }

    private async request(query: string, variables: any): Promise<any> {
        const response = await $fetch(VEVO_TV_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            },
            body: {
                query,
                variables
            },
        }) as any;
        if (response?.errors) {
            throw new Error(response.errors.message);
        }
        return response;
    }

    async getArtist(
        id: string,
        videosOffset = 0,
        videosLimit = 32,
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
        limit = 32,
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
        return this.request(QUERY_GET_VIDEO, { id });
    }
}