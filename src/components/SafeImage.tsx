'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSeed?: string | number;
}

export default function SafeImage({ src, alt, fallbackSeed, ...props }: SafeImageProps) {
  const defaultSeed = fallbackSeed || alt?.replace(/[^a-zA-Z0-9]/g, '') || 'fallback';
  const fallbackUrl = `https://picsum.photos/seed/${defaultSeed}/600/400`;
  
  const [imgSrc, setImgSrc] = useState<string>(
    typeof src === 'string' && src !== '' ? src : fallbackUrl
  );
  const [hasError, setHasError] = useState(false);

  // Sync state if src prop changes
  useEffect(() => {
    setImgSrc(typeof src === 'string' && src !== '' ? src : fallbackUrl);
    setHasError(false);
  }, [src, fallbackUrl]);

  const { width, height, ...restProps } = props as any;

  return (
    <Image
      src={imgSrc}
      alt={alt || "Image"}
      fill
      style={{ objectFit: 'cover' }}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          // Fallback to a reliable placeholder if the primary image fails to load
          setImgSrc(fallbackUrl);
        }
      }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={false} // Images will lazy load by default, which is good for LCP of off-screen images. The first image on the page could use priority=true ideally, but this is a generic component.
      {...restProps}
    />
  );
}
