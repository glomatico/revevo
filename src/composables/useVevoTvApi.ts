import { VevoTvApi } from "@/lib/vevoTv/api";

const instance = new VevoTvApi();

export function useVevoTvApi() {
  return instance;
}
