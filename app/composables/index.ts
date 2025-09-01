export interface ViewCounts {
  total: number;
}

export interface ArtistVideo {
  id: string;
  title: string;
  thumbnail: string;
  explicit: boolean;
  duration: number;
  viewCounts: ViewCounts;
  artists: VideoArtist[];
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  genre: string;
  lyricsVideo: boolean;
  hls: string;
  dash: string;
  // mp4: VideoMp4[];
  // captions: VideoCaption[];
  // clips: VideoClip[];
  created: string;
  copyright: string;
  copyrightYear: number;
  label: string;
  explicit: boolean;
  duration: number;
  viewCounts: ViewCounts;
  artists: VideoArtist[];
}

export interface VideoArtist {
  role: string;
  artist: Artist;
}

export interface ArtistVideoResult {
  items: ArtistVideo[];
  itemsCount: number;
}

export interface Artist {
  id: string;
  name: string;
  thumbnail: string;
  viewCounts: ViewCounts;
  videos: ArtistVideoResult;
}

export interface ArtistResponse {
  data: {
    artist: Artist | null;
  };
}

export interface ArtistVideosResponse {
  data: {
    artist: {
      videos: ArtistVideoResult;
    } | null;
  };
}

export interface VideoResponse {
  data: {
    video: Video | null;
  };
}