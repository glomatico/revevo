export const VEVO_TV_API_BASE_URL = 'https://api.vevo.com/graphql';

export const QUERY_GET_ARTIST = `
query GetArtist(
  $id: String!
  $videosLimit: Int
  $videosOffset: Int
  $explicit: Boolean
) {
  artist(id: $id) {
    id
    name
    thumbnail
    viewCounts {
      total
    }
    videos(limit: $videosLimit, offset: $videosOffset, explicit: $explicit) {
      itemsCount
      items {
        id
        title
        created
        thumbnail
        explicit
        lyricVideo
        duration
        viewCounts {
          total
        }
        artists {
          role
          artist {
            id
            name
            thumbnail
          }
        }
      }
    }
  }
}
`;

export const QUERY_GET_ARTIST_VIDEOS = `
query GetArtistVideos(
  $id: String!
  $limit: Int
  $offset: Int
  $explicit: Boolean
) {
  artist(id: $id) {
    videos(limit: $limit, offset: $offset, explicit: $explicit) {
      itemsCount
      items {
        id
        title
        created
        thumbnail
        explicit
        lyricVideo
        duration
        viewCounts {
          total
        }
        artists {
          role
          artist {
            id
            name
            thumbnail
          }
        }
      }
    }
  }
}
`;

export const QUERY_GET_VIDEO = `
query GetVideo($id: String!) {
  video(id: $id) {
    id
    title
    thumbnail
    genre
    artists {
      role
      artist {
        id
        name
        thumbnail
      }
    }
    explicit
    lyricVideo
    hls
    dash
    mp4 {
      quality
      url
    }
    captions {
      srt {
        url
      }
      vtt {
        url
      }
      ttml {
        url
      }
    }
    created
    duration
    copyright
    copyrightYear
    label
    viewCounts {
      total
    }
  }
}
`;

export const QUERY_CONTINUOUS_PLAY = `
query GetContinuousPlay(
  $videoId: String!
  $offset: Int
  $limit: Int
  $explicit: Boolean
) {
  continuousPlay(videoId: $videoId) {
    id
    title
    items(limit: $limit, offset: $offset, explicit: $explicit)
    {
      video {
        id
        title
        thumbnail
        duration
        explicit
        viewCounts {
          total
        }
        artists {
          role
          artist {
            id
            name
            thumbnail
          }
        }
      }
    }
  }
}
`;

export const QUERY_SEARCH = `
query SearchAll(
  $query: String!
  $videosOffset: Int
  $videosLimit: Int
  $artistsOffset: Int
  $artistsLimit: Int
  $playlistsOffset: Int
  $playlistsLimit: Int
  $explicit: Boolean
) {
  videoSearch(
    query: $query
    explicit: $explicit
    offset: $videosOffset
    limit: $videosLimit
  ) {
    itemsCount
    items {
      id
      title
      thumbnail
      duration
      explicit
      created
      artists {
        role
        artist {
          id
          name
          thumbnail
        }
      }
      viewCounts {
        total
      }
    }
  }
  artistSearch(
    query: $query
    explicit: $explicit
    offset: $artistsOffset
    limit: $artistsLimit
  ) {
    itemsCount
    items {
      id
      name
      thumbnail
      viewCounts {
        total
      }
    }
  }
  playlistSearch(
    query: $query
    explicit: $explicit
    offset: $playlistsOffset
    limit: $playlistsLimit
  ) {
    itemsCount
    items {
      id
      title
      thumbnail
    }
  }
}
`;

export const QUERY_GET_CONTAINER = `
query GetContainer(
  $id: String!
  $explicit: Boolean
  $offset: Int
  $limit: Int
) {
  container(id: $id) {
    id
    type
    title
    description
    thumbnail
    items(explicit: $explicit, offset: $offset, limit: $limit) {
      video {
        id
        title
        created
        thumbnail
        explicit
        lyricVideo
        duration
        viewCounts {
          total
        }
        artists {
          role
          artist {
            id
            name
            thumbnail
          }
        }
      }
    }
    itemsCount
    created
    updated
  }
}
`;

export const QUERY_GET_CONTAINER_VIDEOS = `
query GetContainerVideos(
  $id: String!
  $explicit: Boolean
  $offset: Int
  $limit: Int
) {
  container(id: $id) {
    id
    title
    items(explicit: $explicit, offset: $offset, limit: $limit) {
      video {
        id
        title
        created
        thumbnail
        explicit
        lyricVideo
        duration
        viewCounts {
          total
        }
        artists {
          role
          artist {
            id
            name
            thumbnail
          }
        }
      }
    }
    itemsCount
  }
}
`;
