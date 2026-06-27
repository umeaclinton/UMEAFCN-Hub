'use client';

import { useState, useEffect } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSeed?: string | number;
}

export default function SafeImage({ src, alt, fallbackSeed, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync state if src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          // Fallback to a reliable placeholder if the primary image fails to load
          const seed = fallbackSeed || alt?.replace(/[^a-zA-Z0-9]/g, '') || 'fallback';
          setImgSrc(`https://picsum.photos/seed/${seed}/600/400`);
        }
      }}
      {...props}
    />
  );
}
