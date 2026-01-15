import { VEVO_BASE_API_URL, VEVO_AUTH_API_BODY, VEVO_AUTH_API_URL, QUERY_GET_VIDEOS } from "./constants";
import type { TokenData } from "./types";

export class VevoApi {
  private tokenData: TokenData | null = null;

  constructor() { }

  private get expiredToken(): boolean {
    if (!this.tokenData) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= this.tokenData.expiresAt;
  }

  private async request(query: string, variables: any): Promise<any> {
    if (!this.tokenData || this.expiredToken) {
      await this.setupToken();
    }

    const response = await $fetch(VEVO_BASE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.tokenData?.token}`,
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

  private async getAuthData(): Promise<any> {
    const respose = await $fetch(VEVO_AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: VEVO_AUTH_API_BODY,
    }) as any;

    return respose;
  }

  private async getTokenDataCookie(): Promise<TokenData | null> {
    const tokenCookie = useCookie<TokenData | null>('token_data');
    return tokenCookie.value;
  }

  private async setTokenDataCookie(tokenData: TokenData, maxAge: number): Promise<void> {
    const tokenCookie = useCookie<TokenData>('token_data', {
      maxAge,
    });
    tokenCookie.value = tokenData;
  }

  private async setupToken(): Promise<void> {
    const tokenDataCookie = await this.getTokenDataCookie();

    if (tokenDataCookie) {
      this.tokenData = tokenDataCookie;
      return;
    }

    const authData = await this.getAuthData();
    const token = authData.access_token;
    const expiresIn = authData.expires_in;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn - 60;

    this.tokenData = {
      token,
      expiresAt,
    };
    await this.setTokenDataCookie(this.tokenData, expiresIn - 60);
  }

  async getVideos(ids: string[]): Promise<any> {
    return this.request(QUERY_GET_VIDEOS, { ids });
  }
}