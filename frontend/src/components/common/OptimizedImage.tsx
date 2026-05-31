"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  /** Show a skeleton pulse while loading */
  showSkeleton?: boolean;
  /** Extra className for the wrapper div */
  wrapperClassName?: string;
  /** Fallback JSX shown on image error */
  fallback?: React.ReactNode;
}

/**
 * Production-grade image wrapper around next/image.
 * - Prevents CLS with a fill-based skeleton while the image loads.
 * - Smooth opacity fade-in on first load (no janky pop).
 * - Gracefully swaps to a fallback slot on error.
 * - Passes all next/image props through unchanged.
 */
export default function OptimizedImage({
  showSkeleton = true,
  wrapperClassName = "",
  fallback,
  className = "",
  alt,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored && fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      {/* Skeleton shimmer visible until image loads */}
      {showSkeleton && !loaded && (
        <span
          aria-hidden="true"
          className={`absolute inset-0 animate-pulse bg-slate-100 dark:bg-slate-800 ${wrapperClassName}`}
          style={{ borderRadius: "inherit" }}
        />
      )}

      <Image
        {...props}
        alt={alt || ""}
        className={`transition-opacity duration-500 ease-in-out ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
      />
    </>
  );
}
