export const VEVO_AUTH_API_URL = "https://accounts.vevo.com/token";
export const VEVO_AUTH_API_BODY = {
  client_id: "SPupX1tvqFEopQ1YS6SS",
  grant_type: "urn:vevo:params:oauth:grant-type:anonymous",
};

export const VEVO_BASE_API_URL = "https://veil.vevoprd.com/graphql";

export const QUERY_GET_VIDEOS = `
query Video($ids: [String]!) {
  videos(ids: $ids) {
    data {
      id
      basicMetaV3 {
        isrc
        title
        releaseDate
        copyright
        credits {
          role
          name
        }
        genres
        thumbnailUrl
        duration
        explicit
        artists {
          id
          basicMeta {
            name
            thumbnailUrl
            urlSafeName
          }
        }
        categories
      }
      streamsV3 {
        format
        quality
        url
      }
      views {
        viewsTotal
        youTubeId
      }
    }
  }
}
`;
