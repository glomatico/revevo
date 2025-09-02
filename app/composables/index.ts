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
  genre: string | null;
  lyricsVideo: boolean | null;
  hls: string | null;
  dash: string | null;
  mp4: VideoMp4[] | null;
  created: string | null;
  copyright: string | null;
  copyrightYear: number | null;
  label: string | null;
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

export interface ArtistVideos {
  items: Video[];
  itemsCount: number;
}

export interface Artist {
  id: string;
  name: string;
  thumbnail: string;
  viewCounts: ViewCounts;
  videos: ArtistVideos;
}

export interface ContinuousPlay {
  id: string;
  title: string;
  items: ContinuousPlayItem[];
}

export interface ContinuousPlayItem {
  video: Video;
}

export interface ArtistResponse {
  data: {
    artist: Artist | null;
  };
}

export interface ArtistVideographyResponse {
  data: {
    artist: {
      videos: ArtistVideos;
    } | null;
  };
}

export interface VideoResponse {
  data: {
    video: Video | null;
  };
}

export interface ContinuousPlayResponse {
  data: {
    continuousPlay: ContinuousPlay | null;
  };
}


export const formatDuration = (milliseconds: number): string => {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ":" + String(seconds).padStart(2, '0');
};
