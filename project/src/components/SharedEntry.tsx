import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Calendar, Heart, Tag, ArrowLeft } from 'lucide-react';
import { loadSharedEntry } from '../utils/sharing';
import { loadEntries } from '../utils/storage';

export function SharedEntry() {
  const { shareId } = useParams<{ shareId: string }>();
  const [sharedData, setSharedData] = useState<any>(null);
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!shareId) {
      setError('Invalid share link');
      setLoading(false);
      return;
    }

    // Load shared entry data
    const shareData = loadSharedEntry(shareId);
    if (!shareData) {
      setError('This shared link has expired or is invalid');
      setLoading(false);
      return;
    }

    // Load the actual entry
    const entries = loadEntries();
    const foundEntry = entries.find(e => e.id === shareData.entryId);
    if (!foundEntry) {
      setError('The shared reflection could not be found');
      setLoading(false);
      return;
    }

    setSharedData(shareData);
    setEntry(foundEntry);
    setLoading(false);
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading shared reflection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Link Unavailable</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Go to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    if (score >= 4) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 8) return '😊';
    if (score >= 6) return '🙂';
    if (score >= 4) return '😐';
    return '😔';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🌟 Shared Reflection</h1>
          <p className="text-blue-200">Someone shared their personal growth moment with you</p>
        </div>

        {/* Shared Entry Card */}
        <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-purple-500" />
              <span className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {formatDate(entry.date)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                entry.category === 'work' ? 'bg-blue-100 text-blue-800' :
                entry.category === 'health' ? 'bg-green-100 text-green-800' :
                entry.category === 'learning' ? 'bg-purple-100 text-purple-800' :
                entry.category === 'goals' ? 'bg-yellow-100 text-yellow-800' :
                entry.category === 'relationships' ? 'bg-pink-100 text-pink-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {entry.category}
              </span>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getMoodColor(entry.moodScore)}`}>
              {getMoodEmoji(entry.moodScore)} {entry.moodScore}/10
            </span>
          </div>

          {/* Photo */}
          <div className="px-8 pb-6">
            <img
              src={entry.photo}
              alt="Shared reflection moment"
              className="w-full h-72 object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Content */}
          <div className="px-8 pb-8 space-y-6">
            {/* Thought */}
            <div>
              <p className="text-gray-800 leading-relaxed text-lg font-medium">{entry.thought}</p>
            </div>

            {/* Emotions */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6 text-pink-500" />
                <span className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">💖 Emotions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {entry.emotions.map((emotion: string, index: number) => (
                  <span
                    key={emotion}
                    className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300 ${
                      index === 0
                        ? 'bg-gradient-to-r from-pink-200 to-pink-300 text-pink-900'
                        : 'bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900'
                    }`}
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <Tag className="w-6 h-6 text-blue-500" />
                  <span className="text-base font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">🏷️ Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 rounded-full text-sm font-bold shadow-lg"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Message */}
            {sharedData.settings.message && (
              <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
                <h4 className="text-lg font-bold text-blue-900 mb-3">💌 Personal Message</h4>
                <p className="text-blue-800 leading-relaxed">{sharedData.settings.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Start Your Own Reflection Journey</span>
          </button>
        </div>
      </div>
    </div>
  );
}