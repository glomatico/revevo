import { $fetch } from "ofetch";
import {
  VEVO_AUTH_API_BODY,
  VEVO_AUTH_API_URL,
  VEVO_LEGACY_API_BASE_URL,
} from "./constants";
import type { TokenData } from "./types";
import { useCookies } from "@vueuse/integrations/useCookies";

export class VevoApi {
  constructor(private tokenData: TokenData | null = null) {}

  private get expiredToken(): boolean {
    if (!this.tokenData) return true;
    const now = Math.floor(Date.now() / 1000);
    return now >= this.tokenData.expiresAt;
  }

  private async request(path: string): Promise<any> {
    if (!this.tokenData || this.expiredToken) {
      await this.setupToken();
    }

    const response = (await $fetch(`${VEVO_LEGACY_API_BASE_URL}/${path}`, {
      query: {
        token: this.tokenData?.token,
      },
    })) as any;

    if (response?.errors?.length) {
      throw new Error(
        response.errors.map((error: any) => error.message).join(", "),
      );
    }

    return response;
  }

  private async getAuthData(): Promise<any> {
    const respose = (await $fetch(VEVO_AUTH_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: VEVO_AUTH_API_BODY,
    })) as any;

    return respose;
  }

  private async getTokenDataCookie(): Promise<TokenData | null> {
    const cookies = useCookies();
    return cookies.get("legacy_token_data") as TokenData | null;
  }

  private async setTokenDataCookie(
    tokenData: TokenData,
    maxAge: number,
  ): Promise<void> {
    const cookies = useCookies();
    cookies.set("legacy_token_data", tokenData, { maxAge });
  }

  private async setupToken(): Promise<void> {
    const tokenDataCookie = await this.getTokenDataCookie();

    if (tokenDataCookie) {
      this.tokenData = tokenDataCookie;
      return;
    }

    const authData = await this.getAuthData();
    const token = authData.legacy_token;
    const expiresIn = authData.expires_in;
    const expiresAt = Math.floor(Date.now() / 1000) + expiresIn - 60;

    if (!token) {
      throw new Error("Vevo auth response did not include a legacy token.");
    }

    this.tokenData = {
      token,
      expiresAt,
    };
    await this.setTokenDataCookie(this.tokenData, expiresIn - 60);
  }

  async getVideo(id: string): Promise<any> {
    return this.request(`video/${encodeURIComponent(id)}`);
  }

  async getVideoStreams(id: string): Promise<any> {
    return this.request(`video/${encodeURIComponent(id)}/streams`);
  }
}
