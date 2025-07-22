import React, { useState } from 'react';
import { Calendar, TrendingUp, Heart, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { Entry, WeeklyReflection, MonthlyReflection } from '../types';

interface ReflectionSummaryProps {
  entries: Entry[];
}

export function ReflectionSummary({ entries }: ReflectionSummaryProps) {
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('weekly');
  const [currentPeriod, setCurrentPeriod] = useState(0);

  const generateWeeklyReflections = (): WeeklyReflection[] => {
    const weeks: WeeklyReflection[] = [];
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Group entries by week
    const weekGroups: { [key: string]: Entry[] } = {};
    
    sortedEntries.forEach(entry => {
      const date = new Date(entry.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(entry);
    });

    Object.entries(weekGroups).forEach(([weekStart, weekEntries]) => {
      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      const averageMood = weekEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / weekEntries.length;
      const emotionCounts: { [key: string]: number } = {};
      
      weekEntries.forEach(entry => {
        entry.emotions.forEach(emotion => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });
      
      const topEmotions = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion);

      const highlights = weekEntries
        .filter(entry => entry.moodScore >= 7)
        .slice(0, 2)
        .map(entry => entry.thought.substring(0, 100) + '...');

      weeks.push({
        weekStart: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weekEnd: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        averageMood: Math.round(averageMood * 10) / 10,
        topEmotions,
        entryCount: weekEntries.length,
        highlights,
        growthNote: generateGrowthNote(averageMood, topEmotions)
      });
    });

    return weeks.sort((a, b) => new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime());
  };

  const generateMonthlyReflections = (): MonthlyReflection[] => {
    const months: MonthlyReflection[] = [];
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Group entries by month
    const monthGroups: { [key: string]: Entry[] } = {};
    
    sortedEntries.forEach(entry => {
      const date = new Date(entry.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(entry);
    });

    Object.entries(monthGroups).forEach(([monthKey, monthEntries]) => {
      const [year, month] = monthKey.split('-').map(Number);
      const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long' });
      
      const averageMood = monthEntries.reduce((sum, entry) => sum + entry.moodScore, 0) / monthEntries.length;
      
      // Calculate trend
      const firstHalf = monthEntries.slice(Math.floor(monthEntries.length / 2));
      const secondHalf = monthEntries.slice(0, Math.floor(monthEntries.length / 2));
      const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.moodScore, 0) / secondHalf.length;
      
      let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
      if (secondHalfAvg > firstHalfAvg + 0.5) moodTrend = 'improving';
      else if (secondHalfAvg < firstHalfAvg - 0.5) moodTrend = 'declining';
      
      const emotionCounts: { [key: string]: number } = {};
      monthEntries.forEach(entry => {
        entry.emotions.forEach(emotion => {
          emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
        });
      });
      
      const topEmotions = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion);

      months.push({
        month: monthName,
        year,
        averageMood: Math.round(averageMood * 10) / 10,
        topEmotions,
        entryCount: monthEntries.length,
        moodTrend,
        keyInsights: generateKeyInsights(monthEntries, moodTrend)
      });
    });

    return months.sort((a, b) => (b.year * 12 + new Date(`${b.month} 1`).getMonth()) - (a.year * 12 + new Date(`${a.month} 1`).getMonth()));
  };

  const generateGrowthNote = (averageMood: number, topEmotions: string[]): string => {
    if (averageMood >= 7) {
      return `This was a strong week! Your ${topEmotions[0]} energy really shows through.`;
    } else if (averageMood >= 5) {
      return `A balanced week with moments of ${topEmotions[0]}. Keep building on the positive patterns.`;
    } else {
      return `This week had its challenges. Remember that ${topEmotions[0]} feelings are temporary and part of growth.`;
    }
  };

  const generateKeyInsights = (monthEntries: Entry[], trend: string): string[] => {
    const insights = [];
    
    if (trend === 'improving') {
      insights.push('Your mood showed positive improvement throughout the month');
    } else if (trend === 'declining') {
      insights.push('Consider what factors might be affecting your wellbeing');
    }
    
    const highMoodDays = monthEntries.filter(entry => entry.moodScore >= 8).length;
    if (highMoodDays > monthEntries.length * 0.3) {
      insights.push(`You had ${highMoodDays} particularly great days this month`);
    }
    
    const commonTags = monthEntries.flatMap(entry => entry.tags);
    const tagCounts: { [key: string]: number } = {};
    commonTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    const topTag = Object.entries(tagCounts).sort(([, a], [, b]) => b - a)[0];
    if (topTag) {
      insights.push(`"${topTag[0]}" was a recurring theme in your reflections`);
    }
    
    return insights;
  };

  const weeklyReflections = generateWeeklyReflections();
  const monthlyReflections = generateMonthlyReflections();
  
  const currentReflections = viewType === 'weekly' ? weeklyReflections : monthlyReflections;
  const currentReflection = currentReflections[currentPeriod];

  const navigatePeriod = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPeriod > 0) {
      setCurrentPeriod(currentPeriod - 1);
    } else if (direction === 'next' && currentPeriod < currentReflections.length - 1) {
      setCurrentPeriod(currentPeriod + 1);
    }
  };

  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">No reflections yet</h3>
          <p className="text-gray-400">Start journaling to see your reflection summaries</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Reflection Summary</h2>
        <p className="text-gray-600">Your growth journey over time</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => {
              setViewType('weekly');
              setCurrentPeriod(0);
            }}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              viewType === 'weekly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => {
              setViewType('monthly');
              setCurrentPeriod(0);
            }}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              viewType === 'monthly'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {currentReflection && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigatePeriod('prev')}
                disabled={currentPeriod === 0}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {viewType === 'weekly' 
                    ? `${(currentReflection as WeeklyReflection).weekStart} - ${(currentReflection as WeeklyReflection).weekEnd}`
                    : `${(currentReflection as MonthlyReflection).month} ${(currentReflection as MonthlyReflection).year}`
                  }
                </h3>
                <p className="text-blue-100">
                  {currentReflection.entryCount} reflection{currentReflection.entryCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              <button
                onClick={() => navigatePeriod('next')}
                disabled={currentPeriod === currentReflections.length - 1}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Mood Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Average Mood</h4>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-700">{currentReflection.averageMood}</span>
                  <span className="text-blue-600">/10</span>
                  {viewType === 'monthly' && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      (currentReflection as MonthlyReflection).moodTrend === 'improving' ? 'bg-green-100 text-green-800' :
                      (currentReflection as MonthlyReflection).moodTrend === 'declining' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {(currentReflection as MonthlyReflection).moodTrend}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-pink-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <h4 className="font-semibold text-pink-900">Top Emotions</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentReflection.topEmotions.map((emotion, index) => (
                    <span
                      key={emotion}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-pink-200 text-pink-800' : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Insights */}
            {viewType === 'weekly' ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>Growth Note</span>
                </h4>
                <p className="text-gray-700 bg-green-50 p-4 rounded-lg">
                  {(currentReflection as WeeklyReflection).growthNote}
                </p>
                
                {(currentReflection as WeeklyReflection).highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Week Highlights</h4>
                    <div className="space-y-2">
                      {(currentReflection as WeeklyReflection).highlights.map((highlight, index) => (
                        <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-sm text-gray-700">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span>Key Insights</span>
                </h4>
                <div className="space-y-2">
                  {(currentReflection as MonthlyReflection).keyInsights.map((insight, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      <p className="text-sm text-gray-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}