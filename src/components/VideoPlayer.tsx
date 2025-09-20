"use client";

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);
  const [isHypnoticMode, setIsHypnoticMode] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setLoopCount(prev => prev + 1);
      video.currentTime = 0;
      video.play();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // Auto-play when video loads
    video.addEventListener('loadeddata', () => {
      video.play().catch(console.error);
    });

    return () => {
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const resetLoop = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setLoopCount(0);
    video.play().catch(console.error);
  };

  const toggleHypnoticMode = () => {
    setIsHypnoticMode(!isHypnoticMode);
  };

  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = `dream-loop-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className={`relative rounded-lg overflow-hidden bg-black/50 ${
        isHypnoticMode ? 'ring-4 ring-purple-400 ring-opacity-75 animate-pulse' : ''
      }`}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video object-cover"
          loop
          muted
          playsInline
          preload="auto"
        />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <button
            onClick={togglePlayPause}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 text-white hover:bg-white/30 transition-colors"
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        {/* Loop Counter */}
        {loopCount > 0 && (
          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
            🔄 {loopCount} loops
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={togglePlayPause}
          className="flex-1 min-w-[120px] px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play
            </>
          )}
        </button>

        <button
          onClick={resetLoop}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>

        <button
          onClick={toggleHypnoticMode}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            isHypnoticMode 
              ? 'bg-pink-600 hover:bg-pink-700 text-white' 
              : 'bg-gray-600 hover:bg-gray-700 text-white'
          }`}
        >
          <span className={isHypnoticMode ? 'animate-pulse' : ''}>🌀</span>
          Hypnotic
        </button>

        <button
          onClick={downloadVideo}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download
        </button>
      </div>

      {/* Stats & Info */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Loop Count:</span>
          <span className="text-white font-semibold">{loopCount}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-300">Mode:</span>
          <span className="text-white">
            {isHypnoticMode ? '🌀 Hypnotic' : '👁️ Normal'}
          </span>
        </div>
        {loopCount >= 5 && (
          <div className="text-center text-sm text-purple-300 animate-pulse">
            ✨ You're getting hypnotized! Look for hidden transitions...
          </div>
        )}
      </div>
    </div>
  );
}