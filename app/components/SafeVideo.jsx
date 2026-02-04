"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const SafeVideo = forwardRef(({ 
  src, 
  poster, 
  className = "", 
  fallbackImage = null,
  autoPlay = false,
  muted = true,
  loop = false,
  onError = null,
  onPlay = null,
  onPause = null
}, ref) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Expose video ref to parent
  useImperativeHandle(ref, () => ({
    videoRef: videoRef,
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
  }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = (e) => {
      console.warn('Video failed to load:', src, e);
      setHasError(true);
      if (onError) onError(e);
    };

    const handleLoad = () => {
      console.log('Video loaded successfully:', src);
      setIsLoaded(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      console.log('Video can play:', src);
      if (autoPlay && muted) {
        // Try to play the video
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video started playing:', src);
              if (onPlay) onPlay();
            })
            .catch((error) => {
              console.warn('Autoplay failed:', error);
              // Autoplay failed, but don't treat as error - video can still be played manually
            });
        }
      }
    };

    const handlePlay = () => {
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      if (onPause) onPause();
    };

    // Set video properties
    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;
    video.preload = 'metadata';

    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoad);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadstart', () => console.log('Video load started:', src));

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoad);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [src, autoPlay, muted, loop, onError]);

  if (hasError && fallbackImage) {
    console.log('Using fallback image:', fallbackImage);
    return (
      <div 
        className={`${className} bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${fallbackImage})` }}
      />
    );
  }

  if (hasError) {
    console.log('Video error with no fallback, showing placeholder');
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
    <>
      {!isLoaded && !hasError && (
        <div className={`${className} bg-gray-100 flex items-center justify-center`}>
          <div className="text-gray-500 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        controls={false}
        style={{ display: hasError ? 'none' : 'block' }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </>
  );
};

SafeVideo.displayName = 'SafeVideo';

export default SafeVideo;