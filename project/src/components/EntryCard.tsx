import React, { useState } from 'react';
import { Heart, Tag, Brain, Calendar, Trash2, Share2 } from 'lucide-react';
import { Entry } from '../types';
import { ShareModal } from './ShareModal';

interface EntryCardProps {
  entry: Entry;
  onDelete: (id: string) => void;
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

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

  const handleShare = (entryId: string, shareSettings: any) => {
    // In a real app, this would make an API call to create the share link
    console.log('Sharing entry:', entryId, shareSettings);
  };

  return (
    <div className="group relative bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
      {/* Animated border */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/50 via-purple-500/50 to-indigo-500/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
      
      {/* Header */}
      <div className="relative p-8 pb-6 flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-purple-500" />
          <span className="text-base font-bold gradient-text">
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
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            entry.priority === 'high' ? 'bg-red-100 text-red-800' :
            entry.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {entry.priority}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${getMoodColor(entry.moodScore)}`}>
            {getMoodEmoji(entry.moodScore)} {entry.moodScore}/10
          </span>
          <button
            onClick={() => setShowShareModal(true)}
            className="p-3 text-gray-400 hover:text-blue-500 transition-all duration-300 hover:scale-110 rounded-full hover:bg-blue-50"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-3 text-gray-400 hover:text-red-500 transition-all duration-300 hover:scale-110 rounded-full hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Photo */}
      <div className="relative px-8 pb-6">
        <img
          src={entry.photo}
          alt="Reflection moment"
          className="w-full h-72 object-cover rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-2xl"
        />
        <div className="absolute inset-8 bg-gradient-to-t from-black/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative px-8 pb-8 space-y-6">
        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50/80 to-blue-100/80 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-blue-700">{entry.energyLevel || 5}/10</div>
            <div className="text-sm text-blue-600 font-medium">Energy</div>
          </div>
          <div className="bg-gradient-to-r from-green-50/80 to-green-100/80 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-green-700">{entry.productivityScore || 5}/10</div>
            <div className="text-sm text-green-600 font-medium">Productivity</div>
          </div>
          <div className="bg-gradient-to-r from-orange-50/80 to-orange-100/80 p-4 rounded-2xl text-center">
            <div className="text-2xl font-bold text-orange-700">{entry.stressLevel || 5}/10</div>
            <div className="text-sm text-orange-600 font-medium">Stress</div>
          </div>
        </div>

        {/* Thought */}
        <div>
          <p className="text-gray-800 leading-relaxed text-lg font-medium">{entry.thought}</p>
        </div>

        {/* AI Summary */}
        <div className="relative bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl animate-pulse"></div>
          <div className="relative flex items-center space-x-3 mb-3">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="text-base font-bold gradient-text">✨ AI Professional Insight</span>
          </div>
          <p className="relative text-base text-blue-800 font-medium">{entry.aiSummary}</p>
        </div>

        {/* Structured Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gratitude */}
          {entry.gratitudeItems && entry.gratitudeItems.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">🙏</span>
                <span className="text-base font-bold gradient-text">Gratitude</span>
              </div>
              <div className="space-y-2">
                {entry.gratitudeItems.map((item, index) => (
                  <div key={index} className="bg-green-50 p-3 rounded-lg text-sm text-green-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals */}
          {entry.goals && entry.goals.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">🎯</span>
                <span className="text-base font-bold gradient-text">Goals</span>
              </div>
              <div className="space-y-2">
                {entry.goals.map((item, index) => (
                  <div key={index} className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {entry.achievements && entry.achievements.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">🏆</span>
                <span className="text-base font-bold gradient-text">Achievements</span>
              </div>
              <div className="space-y-2">
                {entry.achievements.map((item, index) => (
                  <div key={index} className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          {entry.challenges && entry.challenges.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">⚡</span>
                <span className="text-base font-bold gradient-text">Challenges</span>
              </div>
              <div className="space-y-2">
                {entry.challenges.map((item, index) => (
                  <div key={index} className="bg-red-50 p-3 rounded-lg text-sm text-red-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learnings */}
          {entry.learnings && entry.learnings.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">💡</span>
                <span className="text-base font-bold gradient-text">Learnings</span>
              </div>
              <div className="space-y-2">
                {entry.learnings.map((item, index) => (
                  <div key={index} className="bg-purple-50 p-3 rounded-lg text-sm text-purple-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          {entry.actionItems && entry.actionItems.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg">📋</span>
                <span className="text-base font-bold gradient-text">Action Items</span>
              </div>
              <div className="space-y-2">
                {entry.actionItems.map((item, index) => (
                  <div key={index} className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Emotions */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-6 h-6 text-pink-500" />
            <span className="text-base font-bold gradient-text">💖 Emotions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {entry.emotions.map((emotion, index) => (
              <span
                key={emotion}
                className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105 ${
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
              <span className="text-base font-bold gradient-text">🏷️ Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 rounded-full text-sm font-bold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-white/95 to-red-50/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm mx-4 shadow-2xl border border-white/20">
            <h3 className="text-xl font-bold gradient-text mb-3">🗑️ Delete Entry?</h3>
            <p className="text-gray-700 mb-6 font-medium">This professional reflection will be lost forever.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-bold hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(entry.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold hover:scale-105 shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        entry={entry}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
      />
    </div>
  );
}