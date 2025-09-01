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
  mp4: VideoMp4[];
  created: string;
  copyright: string;
  copyrightYear: number;
  label: string;
  explicit: boolean;
  duration: number;
  viewCounts: ViewCounts;
  artists: VideoArtist[];
}

export interface VideoMp4 {
  quality: string;
  url: string;
}

export interface VideoArtist {
  id: string;
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

export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};
