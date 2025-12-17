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