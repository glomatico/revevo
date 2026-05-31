import { VevoApi } from "@/lib/vevo/api";

const instance = new VevoApi();

export function useVevoApi() {
  return instance;
}
