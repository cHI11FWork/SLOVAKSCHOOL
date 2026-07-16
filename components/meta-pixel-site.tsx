"use client";

import { usePathname } from "next/navigation";
import { MetaPixel, META_PIXEL_MAIN_ID } from "@/components/meta-pixel";

export function MetaPixelSite() {
  const pathname = usePathname();
  if (pathname?.startsWith("/webinar")) return null;

  return <MetaPixel id={META_PIXEL_MAIN_ID} />;
}
