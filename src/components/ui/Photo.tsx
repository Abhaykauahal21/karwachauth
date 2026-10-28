"use client";
/* eslint-disable @next/next/no-img-element -- client photos come from /public or Vercel Blob at any size; a plain img keeps them simple and un-proxied */

import { motion } from "framer-motion";

/**
 * A real photo, graded to sit inside the moonlit film: slightly muted,
 * warm from below like the diya, cool and dark at the edges.
 */
export default function Photo({
  src,
  alt,
  className = "",
  position = "50% 35%",
}: {
  src: string;
  alt: string;
  className?: string;
  position?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        decoding="async"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: position, filter: "saturate(0.88) contrast(1.03) brightness(0.94) sepia(0.08)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(5,9,20,0.55) 100%), linear-gradient(to top, rgba(255,170,90,0.16), transparent 45%)",
        }}
      />
    </div>
  );
}

/** Fades only the outer edges, so the faces in the photo stay fully visible. */
const EDGE_FADE =
  "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)";

/**
 * A photo remembered in the night sky: the whole photo (never cropped) surfaces
 * from a soft blur, its outer edges melting into the stars, drifting gently.
 * The box sets the space; the photo keeps its own shape inside it.
 */
export function DreamPhoto({
  src,
  alt = "",
  className = "",
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={`pointer-events-none flex items-center justify-center ${className}`}
      initial={{ opacity: 0, filter: "blur(14px)", y: 12 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      exit={{ opacity: 0, filter: "blur(12px)", y: -10, transition: { duration: 1.4, ease: "easeIn" } }}
      transition={{ opacity: { duration: 2.4 }, filter: { duration: 2.8 }, y: { duration: 2.8 } }}
    >
      {/* a soft moonlit halo behind the memory */}
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(closest-side,rgba(233,211,161,0.14),transparent)]" />
      <motion.img
        src={src}
        alt={alt}
        decoding="async"
        draggable={false}
        className="relative h-auto max-h-full w-auto max-w-full object-contain"
        style={{
          maskImage: EDGE_FADE,
          WebkitMaskImage: EDGE_FADE,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
          filter: "saturate(0.9) brightness(0.96)",
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/** Warm the browser cache so a photo is ready the moment its scene arrives. */
export function preloadPhotos(urls: (string | undefined)[]) {
  for (const url of urls) {
    if (!url) continue;
    const img = new Image();
    img.decoding = "async";
    img.src = url;
  }
}
