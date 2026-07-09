import { ImageResponse } from "next/og";
import { ogImageElement, ogImageSize } from "@/lib/og-image";

export const alt = "VipStudy — навчання у Словаччині без ЗНО";
export const size = ogImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(ogImageElement(), size);
}
