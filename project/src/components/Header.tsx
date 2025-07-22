import React from 'react';
import { Calendar, Brain, TrendingUp, Grid, BarChart3, Sparkles, Plus } from 'lucide-react';

interface HeaderProps {
  currentView: 'timeline' | 'create' | 'insights' | 'calendar' | 'summary';
  onViewChange: (view: 'timeline' | 'create' | 'insights' | 'calendar' | 'summary') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {

  return (
    <header className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-2xl overflow-hidden border-b-2 border-blue-500/30">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-cyan-500 to-indigo-600 animate-shimmer"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="relative w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                Professional Growth Hub
              </h1>
              <p className="text-xs text-blue-200 font-medium">📊 Data-driven professional development</p>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            {/* Navigation buttons */}
            <button
              onClick={() => onViewChange('timeline')}
              className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                currentView === 'timeline'
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <span className="relative z-10">📅 Timeline</span>
            </button>
            <button
              onClick={() => onViewChange('calendar')}
              className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 ${
                currentView === 'calendar'
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <Grid className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Calendar</span>
            </button>
            <button
              onClick={() => onViewChange('create')}
              className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 ${
                currentView === 'create'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <Plus className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Create</span>
            </button>
            <button
              onClick={() => onViewChange('summary')}
              className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 ${
                currentView === 'summary'
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <BarChart3 className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Reports</span>
            </button>
            <button
              onClick={() => onViewChange('insights')}
              className={`group relative px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center space-x-1 ${
                currentView === 'insights'
                  ? 'bg-white text-slate-900 shadow-xl'
                  : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20'
              }`}
            >
              <Brain className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Analytics</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}