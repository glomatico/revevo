import {
  ALL_FORMATS,
  BufferTarget,
  Conversion,
  Input,
  MkvOutputFormat,
  Output,
  TextSubtitleSource,
  UrlSource,
} from "mediabunny";
import pLimit from "p-limit";
import { LoadingState, PlaybackMethod } from "./enums";
import type { LoadResult } from "./types";
import { useSettings } from "./useSettings";

const limit = pLimit(3);

export const useDownloadManager = () => {
  const { settings } = useSettings();

  const getBestMp4Stream = (mp4: any[]): string => {
    const qualityPriority = ["high", "medium", "low"];

    for (const quality of qualityPriority) {
      const stream = mp4?.find((stream) => stream?.quality === quality);
      if (stream?.url) return stream.url;
    }

    return "";
  };

  const getSafeFileName = (title?: string): string => {
    return (
      (title || "video").replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") ||
      "video"
    );
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(objectUrl);
  };

  const getCaptionVttUrl = (video: any): string => {
    const vtt = video?.captions?.vtt;

    if (typeof vtt === "string") {
      return vtt;
    }

    if (typeof vtt?.url === "string") {
      return vtt.url;
    }

    return "";
  };

  const fetchCaptionVtt = async (url: string): Promise<string> => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Failed to download captions: ${response.status} ${response.statusText}`,
      );
    }

    return response.text();
  };

  const getTags = (video: any) => {
    const artist = Array.isArray(video.artists)
      ? video.artists
          .map((artist: any) => artist?.artist?.name)
          .filter(Boolean)
          .join(", ")
      : undefined;
    const date = video.created ? new Date(video.created) : undefined;

    return {
      title: video.title,
      artist,
      date,
    };
  };

  const download = async (video: any, loadResult: LoadResult<Blob>) => {
    loadResult.loadingState = LoadingState.LOADING;
    loadResult.result = null;
    loadResult.errorMessage = null;

    return limit(async () => {
      try {
        const streamUrl =
          settings.value.playbackMethod === PlaybackMethod.HLS
            ? video.hls
            : getBestMp4Stream(video.mp4);

        if (!streamUrl) {
          throw new Error("No suitable stream URL found for download.");
        }

        const input = new Input({
          source: new UrlSource(streamUrl),
          formats: ALL_FORMATS,
        });

        const target = new BufferTarget();

        const captionVttUrl = getCaptionVttUrl(video);
        const captionVtt = captionVttUrl
          ? await fetchCaptionVtt(captionVttUrl)
          : "";
        const hasCaptions = Boolean(captionVtt);

        const output = new Output({
          format: new MkvOutputFormat(),
          target,
        });

        const conversion = await Conversion.init({
          input,
          output,
          tracks: "primary",
          tags: getTags(video),
        });

        if (hasCaptions) {
          const captionSource = new TextSubtitleSource("webvtt");

          output.addSubtitleTrack(captionSource);

          await output.start();
          await captionSource.add(captionVtt);
          captionSource.close();
        }

        await conversion.execute();

        if (!target.buffer) {
          throw new Error("The MKV buffer was not generated.");
        }

        const fileBaseName = getSafeFileName(video.title);

        const videoBlob = new Blob([target.buffer], {
          type: "video/x-matroska",
        });

        downloadBlob(videoBlob, `${fileBaseName}.mkv`);

        loadResult.result = videoBlob;
        loadResult.loadingState = LoadingState.SUCCESS;
      } catch (error) {
        loadResult.loadingState = LoadingState.ERROR;
        loadResult.errorMessage = (error as Error).message || "Unknown error";
      }
    });
  };

  return {
    download,
  };
};
