export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const captionsApiUrl = config.public.captionsApiUrl;
  const captionsApiToken = config.public.captionsToken;

  const id = event.context.params?.id;

  const response = await fetch(`${captionsApiUrl}/${id}.vtt?token=${captionsApiToken}`, {
    method: 'GET',
  });

  if (response.status === 200) {
    const captions = await response.text();

    event.node.res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    event.node.res.setHeader('Cache-Control', 'public, max-age=3600');

    return captions;
  } else if (response.status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Captions not found',
    });
  } else {
    throw createError({
      statusCode: response.status,
      statusMessage: `Error fetching captions`,
    });
  }
})
