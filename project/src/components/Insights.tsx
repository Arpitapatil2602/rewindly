import React from 'react';
import { TrendingUp, Heart, Tag, Calendar, BarChart3, Zap, Target, Brain } from 'lucide-react';
import { Entry } from '../types';
import { generateBusinessInsights } from '../utils/aiSimulation';

interface InsightsProps {
  entries: Entry[];
}

export function Insights({ entries }: InsightsProps) {
  // Calculate insights
  const totalEntries = entries.length;
  const averageMood = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length).toFixed(1)
    : 0;

  const averageEnergy = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + (entry.energyLevel || 5), 0) / entries.length).toFixed(1)
    : 0;

  const averageProductivity = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + (entry.productivityScore || 5), 0) / entries.length).toFixed(1)
    : 0;

  const averageStress = entries.length > 0 
    ? (entries.reduce((sum, entry) => sum + (entry.stressLevel || 5), 0) / entries.length).toFixed(1)
    : 0;
  // Get recent trend (last 7 entries vs previous 7)
  const recentEntries = entries.slice(0, 7);
  const previousEntries = entries.slice(7, 14);
  const recentMood = recentEntries.length > 0 
    ? recentEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / recentEntries.length
    : 0;
  const previousMood = previousEntries.length > 0 
    ? previousEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / previousEntries.length
    : recentMood;
  
  const trendDirection = recentMood > previousMood ? 'improving' : 
                        recentMood < previousMood ? 'declining' : 'stable';

  // Business insights
  const businessInsights = generateBusinessInsights(entries);
  const totalGoals = entries.reduce((sum, entry) => sum + (entry.goals?.length || 0), 0);
  const totalAchievements = entries.reduce((sum, entry) => sum + (entry.achievements?.length || 0), 0);
  const totalLearnings = entries.reduce((sum, entry) => sum + (entry.learnings?.length || 0), 0);
  const totalActionItems = entries.reduce((sum, entry) => sum + (entry.actionItems?.length || 0), 0);
  // Most frequent emotions
  const emotionCounts = entries.reduce((counts: { [key: string]: number }, entry) => {
    entry.emotions.forEach(emotion => {
      counts[emotion] = (counts[emotion] || 0) + 1;
    });
    return counts;
  }, {});

  const topEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Most frequent tags
  const tagCounts = entries.reduce((counts: { [key: string]: number }, entry) => {
    entry.tags.forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
    return counts;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Category distribution
  const categoryDistribution = entries.reduce((counts: { [key: string]: number }, entry) => {
    const category = entry.category || 'personal';
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  // Monthly mood trend
  const monthlyMood = entries.reduce((monthly: { [key: string]: { total: number; count: number } }, entry) => {
    const month = new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    if (!monthly[month]) monthly[month] = { total: 0, count: 0 };
    monthly[month].total += entry.moodScore;
    monthly[month].count += 1;
    return monthly;
  }, {});

  const monthlyAverages = Object.entries(monthlyMood)
    .map(([month, data]) => ({
      month,
      average: data.total / data.count
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  const getTrendIcon = () => {
    if (trendDirection === 'improving') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trendDirection === 'declining') return <TrendingUp className="w-5 h-5 text-red-500 transform rotate-180" />;
    return <TrendingUp className="w-5 h-5 text-gray-500 transform rotate-90" />;
  };

  const getTrendColor = () => {
    if (trendDirection === 'improving') return 'text-green-700 bg-green-50';
    if (trendDirection === 'declining') return 'text-red-700 bg-red-50';
    return 'text-gray-700 bg-gray-50';
  };

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No insights yet</h3>
          <p className="text-gray-400">Create some reflections to see your growth insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            📊 Professional Growth Analytics
          </h2>
          <p className="text-xl text-gray-600 font-medium">AI-powered insights for data-driven professional development</p>
          <div className="mt-4 flex justify-center space-x-8 text-sm text-gray-500">
            <span>📈 Performance Tracking</span>
            <span>🎯 Goal Achievement</span>
            <span>🧠 Behavioral Insights</span>
            <span>📊 Trend Analysis</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Overview Stats */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">📊 Overview</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reflections</p>
              <p className="text-3xl font-black text-blue-700">{totalEntries}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Average Wellbeing</p>
              <p className="text-3xl font-black text-green-600">{averageMood}/10</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Trend</p>
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="capitalize">{trendDirection}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl shadow-xl border border-yellow-100 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">⚡ Performance</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Energy Level</p>
              <p className="text-3xl font-black text-yellow-600">{averageEnergy}/10</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full" style={{width: `${(Number(averageEnergy) / 10) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Productivity</p>
              <p className="text-3xl font-black text-green-600">{averageProductivity}/10</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full" style={{width: `${(Number(averageProductivity) / 10) * 100}%`}}></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Stress Level</p>
              <p className="text-3xl font-black text-red-600">{averageStress}/10</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full" style={{width: `${(Number(averageStress) / 10) * 100}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">🎯 Goals & Growth</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Goals Set</p>
              <p className="text-3xl font-black text-purple-600">{totalGoals}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-3xl font-black text-green-600">{totalAchievements}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Key Learnings</p>
              <p className="text-3xl font-black text-blue-600">{totalLearnings}</p>
            </div>
          </div>
        </div>
        {/* Top Emotions */}
        <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-xl border border-pink-100 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">💖 Emotional Patterns</h3>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="space-y-3">
            {topEmotions.map(([emotion, count], index) => (
              <div key={emotion} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">{emotion}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${(count / topEmotions[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Business Insights */}
        <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl border border-indigo-100 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">🧠 AI Business Insights</h3>
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {businessInsights.length > 0 ? (
              businessInsights.map((insight, index) => (
                <div key={index} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border-l-4 border-indigo-500 shadow-md hover:shadow-lg transition-all duration-300">
                  <p className="text-base text-indigo-900 font-semibold leading-relaxed">{insight}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">More reflections needed for AI insights</p>
                <p className="text-sm text-gray-400 mt-1">Create 5+ entries to unlock business intelligence</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900">🏷️ Professional Focus Areas</h3>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Tag className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {Object.entries(categoryDistribution).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-800 capitalize flex items-center space-x-3">
                  <span>{
                    category === 'work' ? '💼' :
                    category === 'health' ? '🏃' :
                    category === 'learning' ? '📚' :
                    category === 'goals' ? '🎯' :
                    category === 'relationships' ? '❤️' : '🌟'
                  }</span>
                  <span>{category}</span>
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${(count / totalEntries) * 100}%` }}
                    />
                  </div>
                  <span className="text-base font-bold text-gray-700 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Mood Trend */}
      {monthlyAverages.length > 1 && (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-xl border border-green-100 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">📈 Professional Wellbeing Trend</h3>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="space-y-5">
            {monthlyAverages.map(({ month, average }) => (
              <div key={month} className="flex items-center space-x-4">
                <div className="w-20 text-base font-semibold text-gray-700">{month}</div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: `${(average / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-base font-bold text-gray-800 w-10">{average.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}