"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function ParallaxImage({
  src,
  alt,
  sizes,
  quality = 92,
  strength = 40,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  quality?: number;
  strength?: number;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-strength, strength]);

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-[-6%]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
