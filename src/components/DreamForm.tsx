"use client";

import { useState } from 'react';

interface DreamFormProps {
  onSubmit: (elements: [string, string, string]) => void;
  isLoading: boolean;
}

export default function DreamForm({ onSubmit, isLoading }: DreamFormProps) {
  const [element1, setElement1] = useState('');
  const [element2, setElement2] = useState('');
  const [element3, setElement3] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!element1.trim() || !element2.trim() || !element3.trim()) {
      return;
    }

    onSubmit([element1.trim(), element2.trim(), element3.trim()]);
  };

  const exampleSets = [
    ['cat', 'galaxy', 'waterfall'],
    ['fire', 'ice', 'wind'],
    ['ocean', 'mountain', 'clock'],
    ['butterfly', 'rainbow', 'mirror'],
  ];

  const fillExample = (example: string[]) => {
    setElement1(example[0]);
    setElement2(example[1]);
    setElement3(example[2]);
  };

  const isValid = element1.trim() && element2.trim() && element3.trim();

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            First Dream Element
          </label>
          <input
            type="text"
            value={element1}
            onChange={(e) => setElement1(e.target.value)}
            placeholder="e.g., cat, fire, ocean..."
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            disabled={isLoading}
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Second Dream Element
          </label>
          <input
            type="text"
            value={element2}
            onChange={(e) => setElement2(e.target.value)}
            placeholder="e.g., galaxy, ice, mountain..."
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            disabled={isLoading}
            maxLength={50}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Third Dream Element
          </label>
          <input
            type="text"
            value={element3}
            onChange={(e) => setElement3(e.target.value)}
            placeholder="e.g., waterfall, wind, clock..."
            className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            disabled={isLoading}
            maxLength={50}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Generating Dream Loop...
            </div>
          ) : (
            '✨ Generate Dream Loop'
          )}
        </button>
      </form>

      {/* Example Sets */}
      <div className="border-t border-white/20 pt-6">
        <h3 className="text-sm font-medium text-gray-200 mb-3">Try these examples:</h3>
        <div className="grid grid-cols-2 gap-2">
          {exampleSets.map((example, index) => (
            <button
              key={index}
              onClick={() => fillExample(example)}
              disabled={isLoading}
              className="text-left p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="text-sm text-gray-300">
                {example.join(' → ')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-200 mb-2">💡 Tips for better loops:</h4>
        <ul className="text-xs text-blue-300 space-y-1">
          <li>• Use concrete, visual elements (cat, fire, ocean)</li>
          <li>• Mix different categories (animal, nature, object)</li>
          <li>• Keep elements simple and recognizable</li>
          <li>• Think about how they might morph into each other</li>
        </ul>
      </div>
    </div>
  );
}