export const PSEUDO_COUNTRY_ISRC_PREFIXES = ['QM', 'QN', 'QT', 'QZ'];

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
  likes: number;
  videoData: ArtistVideos;
  relatedArtists: BasicArtistMeta[];
};

export interface BasicArtistMeta {
  name: string;
  thumbnailUrl: string;
  urlSafeName: string;
  views: Views;
  genres: string[];
  role: string;
  links: Link[];
  bio: Bio;
};

export interface Link {
  type: string;
  url: string;
};

export interface Bio {
  text: string;
  source: string;
  birthCity: string;
  birthName: string;
  origin: string;
  dateOfBirth: string;
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
  likes: number;
  streamsV3: StreamsV3[];
  relatedVideos: VideoList;
  views: Views;
};

export interface BasicVideoMetaV3 {
  isrc: string;
  title: string;
  thumbnailUrl: string;
  releaseDate: string;
  copyright: string;
  credits: CreditsV3[];
  genres: string[];
  duration: number;
  explicit: boolean;
  artists: Artist[];
  errorCode: string;
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
  youTubeId: string;
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

export interface BasicPlaylistMeta {
  title: string;
  image_url: string;
};

export interface Playlist {
  id: string;
  basicMeta: BasicPlaylistMeta;
};

export interface HomePageContainerItem {
  item: {
    video: Video;
    playlist: Playlist;
    artist: Artist;
  };
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
    artists: Artist[];
  };
};

export interface VideoResponse {
  data: {
    videos: VideoList;
  };
};

export interface SearchResultResponse {
  data: {
    search: SearchResult;
  };
};

export interface HomePageResponse {
  data: {
    homePage: HomePage;
  };
};

export interface PlaylistResponse {
  data: {
    playlists: Playlist[];
  };
};

export interface PageMetadata {
  title: string;
  path: string;
  icon: string;
};

export enum LoadingState {
  IDLE = "idle",
  LOADING = "loading",
  LOADED = "loaded",
  ERROR = "error",
};

export enum PlaybackMethod {
  HLS = "hls",
  MP4 = "mp4",
};

export interface Settings {
  playbackMethod: PlaybackMethod;
  enableCaptions: boolean;
  hidePseudoCountryIsrc: boolean;
};

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

export const isArtistValid = (artist: Artist | null): boolean => {
  return Boolean(artist?.basicMeta?.name);
};

export const isVideoValid = (video: Video | null, hidePseudoCountryIsrc: boolean = false, checkStreams: boolean = false): boolean => {
  return Boolean(
    video?.basicMetaV3?.title
    &&
    (hidePseudoCountryIsrc ? (!PSEUDO_COUNTRY_ISRC_PREFIXES.includes(video?.basicMetaV3?.isrc.substring(0, 2))) : true)
    &&
    (checkStreams ? video?.streamsV3?.some(stream => stream?.url) : true)
  );
};

export const isPlaylistValid = (playlist: Playlist | null): boolean => {
  return Boolean(playlist?.basicMeta?.title);
};
