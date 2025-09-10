export interface TokenData {
  access_token: string;
  legacy_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token: string;
  user_id: string;
};

export interface Artist {
  id: string;
  basicMeta: BasicArtistMeta;
  likes: number | null;
  videoData: ArtistVideos | null;
  relatedArtists: BasicArtistMeta[] | null;
};

export interface BasicArtistMeta {
  name: string;
  thumbnailUrl: string;
  urlSafeName: string | null;
  views: Views | null;
  genres: string[] | null;
  role: string | null;
  links: Link[] | null;
  bio: Bio | null;
};

export interface Link {
  type: string;
  url: string;
};

export interface Bio {
  text: string | null;
  source: string | null;
  birthCity: string | null;
  birthName: string | null;
  origin: string | null;
  dateOfBirth: string | null;
};

export interface ArtistVideos {
  videos: VideoList;
};

export interface VideoList {
  data: Video[];
  paging: Paging;
};

export interface Video {
  basicMetaV3: BasicVideoMetaV3;
  likes: number | null;
  streamsV3: StreamsV3[] | null;
  relatedVideos: VideoList | null;
  views: Views | null;
};

export interface BasicVideoMetaV3 {
  isrc: string;
  title: string;
  thumbnailUrl: string;
  releaseDate: string | null;
  copyright: string | null;
  credits: CreditsV3[] | null;
  genres: string[] | null;
  duration: number | null;
  explicit: boolean | null;
  artists: Artist[] | null;
  errorCode: string | null;
};

export interface CreditsV3 {
  role: string;
  name: string;
};

export interface StreamsV3 {
  format: string;
  quality: string;
  url: string;
};

export interface Views {
  viewsTotal: number;
  youTubeId: string | null;
};

export interface Paging {
  total: number;
  size: number;
  pages: number;
  page: number;
  next: string;
};

export interface SearchResult {
  artists: {
    items: Artist[];
    total: number;
  };
  videos: {
    items: Video[];
    total: number;
  };
};

export interface Playlist {
  id: string;
};

export interface HomePageContainerItem {
  item: {
    video: Video | null;
    playlist: Playlist | null;
    artist: Artist | null;
  } | null;
};

export interface HomePageContainer {
  title: string;
  description: string;
  serviceName: string;
  items: HomePageContainerItem[];
};

export interface HomePage {
  containersV2: HomePageContainer[];
};

export interface ArtistResponse {
  data: {
    artists: Artist[] | null;
  } | null;
};

export interface VideoResponse {
  data: {
    videos: VideoList | null;
  } | null;
};

export interface SearchResultResponse {
  data: {
    search: SearchResult | null;
  } | null;
};

export interface HomePageResponse {
  data: {
    homePage: HomePage | null;
  } | null;
};

export interface PageMetadata {
  title: string;
  path: string;
  icon: string;
}

export enum LoadingState {
  Loading = "Loading",
  Loaded = "Loaded",
  Error = "Error",
}

export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};


export const resizeImageUrl = (url: string, width: number, height: number): string => {
  const urlObj = new URL(url);
  urlObj.searchParams.set('width', width.toString());
  urlObj.searchParams.set('height', height.toString());
  return urlObj.toString();
};
