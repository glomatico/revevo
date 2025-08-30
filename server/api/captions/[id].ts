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

  const captions = await getCaptions(id);

  if (captions === null) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Captions not found',
    });
  }

  event.res.setHeader('Content-Type', 'text/vtt; charset=utf-8');
  event.res.setHeader('Cache-Control', 'public, max-age=3600');

  return captions;
})
