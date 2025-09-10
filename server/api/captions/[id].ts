import { useVideo } from '~/composables/video';

export default defineEventHandler(async (event) => {
  const { getCaptions } = useVideo();
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Video ID is required',
    });
  }

  try {
    const captions = await getCaptions(id);

    event.node.res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
    event.node.res.setHeader('Cache-Control', 'public, max-age=3600');

    return captions;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching captions',
    });
  }
})
