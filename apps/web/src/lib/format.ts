import { site } from "@/config/site";
export const inr = (n: number) => `${site.currency}${n.toLocaleString("en-IN")}`;
