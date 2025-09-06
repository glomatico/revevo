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
  labels: string | null;
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

export interface ArtistResponse {
  data: {
    artists: Artist[] | null;
  } | null;
};

export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};
