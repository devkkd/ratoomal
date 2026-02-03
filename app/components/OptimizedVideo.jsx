// components/OptimizedVideo.jsx
"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader } from 'lucide-react';

const OptimizedVideo = ({ src, thumbnail, className }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Preload only metadata to save bandwidth
    if (videoRef.current) {
      videoRef.current.preload = 'metadata';
    }
  }, []);

  const handleVideoError = (e) => {
    console.error('Video error:', e);
    setError(true);
    setIsLoading(false);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => {
          console.error('Video play error:', err);
          setError(true);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <p className="text-gray-500">Video failed to load</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative overflow-hidden bg-black`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <Loader className="w-8 h-8 text-white animate-spin" />
        </div>
      )}
      
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        muted={isMuted}
        playsInline
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onEnded={() => setIsPlaying(false)}
        poster={thumbnail}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      />
      
      {/* Video Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full">
        <button
          onClick={togglePlayPause}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={20} className="text-white" />
          ) : (
            <Play size={20} className="text-white" />
          )}
        </button>
        
        <button
          onClick={toggleMute}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX size={20} className="text-white" />
          ) : (
            <Volume2 size={20} className="text-white" />
          )}
        </button>
        
        <span className="text-white text-sm font-medium px-2">
          360° Interactive View
        </span>
      </div>
      
      {/* Video Badge */}
      <div className="absolute top-4 left-4 bg-[#C08237] text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <Play size={12} /> VIDEO
      </div>
    </div>
  );
};

export default OptimizedVideo;