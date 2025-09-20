"use client";

import { useState } from 'react';
import DreamForm from '@/components/DreamForm';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDreamSubmit = async (elements: [string, string, string]) => {
    setIsGenerating(true);
    setError(null);
    setGeneratedVideo(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ elements }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();
      setGeneratedVideo(data.videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            🌙 Dream Loop Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform 3 dream elements into hypnotic, seamlessly looping videos
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Form Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Create Your Dream</h2>
              <DreamForm 
                onSubmit={handleDreamSubmit} 
                isLoading={isGenerating}
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200">{error}</p>
                </div>
              )}
            </div>

            {/* Video Section */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-semibold text-white mb-6">Your Dream Loop</h2>
              
              {isGenerating && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
                  <p className="text-gray-300">Generating your dream loop...</p>
                  <p className="text-sm text-gray-400 mt-2">This may take 1-2 minutes</p>
                </div>
              )}
              
              {generatedVideo && !isGenerating && (
                <VideoPlayer videoUrl={generatedVideo} />
              )}
              
              {!generatedVideo && !isGenerating && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🎬</div>
                  <p>Your hypnotic dream loop will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Powered by Seedream AI • Built for seamless dream loops</p>
        </div>
      </div>
    </div>
  );
}
