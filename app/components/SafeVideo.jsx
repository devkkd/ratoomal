"use client";

import React, { useRef, useState, useEffect } from 'react';

const SafeVideo = ({ 
  src, 
  poster, 
  className = "", 
  fallbackImage = null,
  autoPlay = false,
  muted = true,
  loop = false,
  onError = null 
}) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = (e) => {
      console.warn('Video failed to load:', src, e);
      setHasError(true);
      if (onError) onError(e);
    };

    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      if (autoPlay && muted) {
        video.play().catch(handleError);
      }
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [src, autoPlay, muted, onError]);

  if (hasError && fallbackImage) {
    return (
      <div 
        className={`${className} bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${fallbackImage})` }}
      />
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-gray-500 text-center">
          <p>Video unavailable</p>
          {poster && (
            <img 
              src={poster} 
              alt="Video poster" 
              className="mt-2 max-w-full h-auto"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline
      preload="metadata"
      style={{ display: hasError ? 'none' : 'block' }}
    >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
};

export default SafeVideo;