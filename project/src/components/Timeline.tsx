import React, { useState } from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import { Entry } from '../types';
import { EntryCard } from './EntryCard';

interface TimelineProps {
  entries: Entry[];
  onDeleteEntry: (id: string) => void;
}

export function Timeline({ entries, onDeleteEntry }: TimelineProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEmotion, setFilterEmotion] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'mood'>('date');

  // Get unique emotions for filter
  const allEmotions = [...new Set(entries.flatMap(entry => entry.emotions))].sort();

  // Filter and sort entries
  const filteredEntries = entries
    .filter(entry => {
      const matchesSearch = entry.thought.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesEmotion = !filterEmotion || entry.emotions.includes(filterEmotion);
      return matchesSearch && matchesEmotion;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.moodScore - a.moodScore;
      }
    });

  const groupedEntries = filteredEntries.reduce((groups: { [key: string]: Entry[] }, entry) => {
    const month = new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    if (!groups[month]) groups[month] = [];
    groups[month].push(entry);
    return groups;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Reflection Journey</h2>
        <p className="text-gray-600">
          {entries.length} reflection{entries.length !== 1 ? 's' : ''} captured
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search thoughts and tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Emotion Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterEmotion}
              onChange={(e) => setFilterEmotion(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All emotions</option>
              {allEmotions.map(emotion => (
                <option key={emotion} value={emotion}>{emotion}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'mood')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="date">Sort by date</option>
              <option value="mood">Sort by mood</option>
            </select>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            {entries.length === 0 ? 'No reflections yet' : 'No matching reflections'}
          </h3>
          <p className="text-gray-400">
            {entries.length === 0 
              ? 'Start your journey by creating your first reflection' 
              : 'Try adjusting your search or filters'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedEntries).map(([month, monthEntries]) => (
            <div key={month}>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 sticky top-4 bg-gray-50 py-2 px-4 rounded-lg border border-gray-200">
                {month}
              </h3>
              <div className="space-y-6">
                {monthEntries.map(entry => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onDelete={onDeleteEntry}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}