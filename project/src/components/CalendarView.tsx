import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Entry } from '../types';

interface CalendarViewProps {
  entries: Entry[];
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

export function CalendarView({ entries, onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getEntryForDate = (dateKey: string) => {
    return entries.find(entry => entry.date === dateKey);
  };

  const getMoodColor = (score: number) => {
    if (score >= 8) return 'bg-green-400';
    if (score >= 6) return 'bg-yellow-400';
    if (score >= 4) return 'bg-orange-400';
    return 'bg-red-400';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const days = [];
  
  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24"></div>);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day);
    const entry = getEntryForDate(dateKey);
    const isSelected = selectedDate === dateKey;
    const isToday = dateKey === new Date().toISOString().split('T')[0];

    days.push(
      <div
        key={day}
        onClick={() => onDateSelect(dateKey)}
        className={`h-24 border border-gray-200 cursor-pointer transition-all hover:bg-gray-50 ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        } ${isToday ? 'bg-blue-100' : ''}`}
      >
        <div className="p-2 h-full flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
              {day}
            </span>
            {entry && (
              <div className={`w-3 h-3 rounded-full ${getMoodColor(entry.moodScore)}`}></div>
            )}
          </div>
          
          {entry && (
            <div className="flex-1 overflow-hidden">
              <img
                src={entry.photo}
                alt="Daily reflection"
                className="w-full h-12 object-cover rounded-sm"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5" />
            <h2 className="text-lg font-semibold">{monthYear}</h2>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-600 border-b border-gray-200">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days}
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span>Great mood (8-10)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span>Good mood (6-7)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <span>Okay mood (4-5)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <span>Low mood (1-3)</span>
          </div>
        </div>
      </div>
    </div>
  );
}