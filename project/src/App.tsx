import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { CreateEntry } from './components/CreateEntry';
import { Timeline } from './components/Timeline';
import { Insights } from './components/Insights';
import { CalendarView } from './components/CalendarView';
import { ReflectionSummary } from './components/ReflectionSummary';
import { loadEntries, deleteEntry } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState<'timeline' | 'create' | 'insights' | 'calendar' | 'summary'>('timeline');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [entries, setEntries] = useState(() => loadEntries());
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEntryCreated = () => {
    setEntries(loadEntries());
    setRefreshKey(prev => prev + 1);
    setCurrentView('timeline');
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = deleteEntry(id);
    setEntries(updatedEntries);
    setRefreshKey(prev => prev + 1);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setCurrentView('timeline');
  };

  const handleLogin = (email: string, password: string) => {
    // In a real app, you would validate credentials with your backend
    console.log('Login attempt:', { email, password });
    setIsAuthenticated(true);
  };

  const handleSignUp = (email: string, password: string, name: string) => {
    // In a real app, you would create account with your backend
    console.log('Signup attempt:', { email, password, name });
    setIsAuthenticated(true);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
        <div className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse`}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
        
        <Header currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="relative pb-8">
          {currentView === 'create' && (
            <CreateEntry onEntryCreated={handleEntryCreated} />
          )}
              
          {currentView === 'timeline' && (
            <Timeline entries={entries} onDeleteEntry={handleDeleteEntry} />
          )}
              
          {currentView === 'calendar' && (
            <div className="max-w-6xl mx-auto px-4 py-12">
              <CalendarView 
                entries={entries} 
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
            </div>
          )}
              
          {currentView === 'summary' && (
            <ReflectionSummary entries={entries} />
          )}
              
          {currentView === 'insights' && (
            <Insights entries={entries} />
          )}
        </main>
      </div>
  );
}

export default App;