export interface ViewCounts {
  total: number;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  explicit: boolean;
  duration: number;
  viewCounts: ViewCounts;
  artists: VideoArtist[];
}

export interface VideoArtist {
  role: string;
  artist: Artist;
}

export interface VideoSearchResult {
  items: Video[];
  itemsCount: number;
}

export interface Artist {
  id: string;
  name: string;
  thumbnail: string;
  viewCounts: ViewCounts;
  videos: VideoSearchResult;
}

export interface ArtistResponse {
  data: {
    artist: Artist | null;
  };
}

export interface ArtistVideosResponse {
  data: {
    artist: {
      videos: VideoSearchResult;
    } | null;
  };
}