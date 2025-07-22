import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Save, Mic, AlertCircle, ImageIcon } from 'lucide-react';
import { Entry } from '../types';
import { analyzeEmotion, generateTags, generateAISummary } from '../utils/aiSimulation';
import { addEntry, getTodaysEntry, canCreateToday } from '../utils/storage';
import { VoiceRecorder } from './VoiceRecorder';
import { v4 as uuidv4 } from 'uuid';

interface CreateEntryProps {
  onEntryCreated: () => void;
}

export function CreateEntry({ onEntryCreated }: CreateEntryProps) {
  const [photo, setPhoto] = useState<string>('');
  const [thought, setThought] = useState('');
  const [category, setCategory] = useState<'personal' | 'work' | 'health' | 'relationships' | 'learning' | 'goals'>('personal');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [productivityScore, setProductivityScore] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['']);
  const [goals, setGoals] = useState<string[]>(['']);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [challenges, setChallenges] = useState<string[]>(['']);
  const [learnings, setLearnings] = useState<string[]>(['']);
  const [actionItems, setActionItems] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useVoice, setUseVoice] = useState(false);
  
  const todaysEntry = getTodaysEntry();
  const canCreate = canCreateToday();

  const updateListItem = (list: string[], setList: (items: string[]) => void, index: number, value: string) => {
    const newList = [...list];
    newList[index] = value;
    if (index === list.length - 1 && value.trim()) {
      newList.push('');
    }
    setList(newList.filter((item, i) => item.trim() || i === newList.length - 1));
  };
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo || !thought.trim()) return;

    setIsProcessing(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      const emotionAnalysis = analyzeEmotion(thought);
      const tags = generateTags(thought);
      const aiSummary = generateAISummary(thought, [emotionAnalysis.primary, ...emotionAnalysis.secondary]);

      const entry: Entry = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        photo,
        thought,
        emotions: [emotionAnalysis.primary, ...emotionAnalysis.secondary],
        tags,
        aiSummary,
        moodScore: emotionAnalysis.moodScore,
        energyLevel: emotionAnalysis.energyLevel,
        productivityScore: emotionAnalysis.productivityScore,
        stressLevel,
        gratitudeItems: gratitudeItems.filter(item => item.trim()),
        goals: goals.filter(item => item.trim()),
        achievements: achievements.filter(item => item.trim()),
        challenges: challenges.filter(item => item.trim()),
        learnings: learnings.filter(item => item.trim()),
        actionItems: actionItems.filter(item => item.trim()),
        category,
        priority,
        createdAt: new Date(),
        isShared: false,
        sharedWith: []
      };

      addEntry(entry);
      onEntryCreated();
      
      setPhoto('');
      setThought('');
      setCategory('personal');
      setPriority('medium');
      setEnergyLevel(5);
      setProductivityScore(5);
      setStressLevel(5);
      setGratitudeItems(['']);
      setGoals(['']);
      setAchievements(['']);
      setChallenges(['']);
      setLearnings(['']);
      setActionItems(['']);
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create entry. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleVoiceTranscription = (transcription: string) => {
    setThought(transcription);
  };

  // Show today's entry if it exists
  if (!canCreate && todaysEntry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Today's Reflection Complete!
            </h2>
            <p className="text-gray-600 mb-8 text-lg">You've already captured today's memory. Come back tomorrow for your next reflection.</p>
            
            <div className="bg-white rounded-2xl p-6 shadow-inner border border-gray-100">
              <img
                src={todaysEntry.photo}
                alt="Today's reflection"
                className="w-full h-56 object-cover rounded-xl mb-4 shadow-md"
              />
              <p className="text-gray-700 text-left leading-relaxed mb-4">{todaysEntry.thought}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 font-medium">{todaysEntry.date}</span>
                <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-md">
                  Mood: {todaysEntry.moodScore}/10
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="relative bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden">
        {/* Animated border */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-[2rem] p-[2px] animate-pulse">
          <div className="bg-gradient-to-br from-white/95 to-purple-50/95 rounded-[2rem] h-full w-full"></div>
        </div>
        
        <div className="relative p-12">
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl animate-pulse-glow"></div>
              <ImageIcon className="relative w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <h2 className="text-4xl font-black gradient-text mb-4 tracking-tight">
              Today's Professional Reflection
            </h2>
            <p className="text-gray-600 text-xl font-medium">✨ Capture insights, track progress, and plan your growth</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Category and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-lg font-bold gradient-text">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 shadow-inner bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium text-lg"
                >
                  <option value="personal">🌟 Personal</option>
                  <option value="work">💼 Work</option>
                  <option value="health">🏃 Health</option>
                  <option value="relationships">❤️ Relationships</option>
                  <option value="learning">📚 Learning</option>
                  <option value="goals">🎯 Goals</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="block text-lg font-bold gradient-text">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 shadow-inner bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium text-lg"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-lg font-bold gradient-text">Energy Level</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Low</span>
                    <span className="font-bold text-purple-600">{energyLevel}/10</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-lg font-bold gradient-text">Productivity</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={productivityScore}
                    onChange={(e) => setProductivityScore(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Low</span>
                    <span className="font-bold text-purple-600">{productivityScore}/10</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="block text-lg font-bold gradient-text">Stress Level</label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressLevel}
                    onChange={(e) => setStressLevel(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Low</span>
                    <span className="font-bold text-purple-600">{stressLevel}/10</span>
                    <span>High</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Photo Upload */}
            <div className="space-y-6">
              <label className="block text-xl font-bold gradient-text">
                Today's Photo
              </label>
              
              {photo ? (
                <div className="relative group">
                  <img
                    src={photo}
                    alt="Today's magical moment"
                    className="w-full h-80 object-cover rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button
                    type="button"
                    onClick={() => setPhoto('')}
                    className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full hover:scale-110 transition-all duration-300 shadow-2xl animate-pulse-glow"
                  >
                    <span className="text-xl font-bold">×</span>
                  </button>
                </div>
              ) : (
                <label className="relative flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-purple-400 rounded-3xl cursor-pointer bg-gradient-to-br from-purple-50/80 to-blue-50/80 hover:from-purple-100/80 hover:to-blue-100/80 transition-all duration-500 hover:border-pink-400 group hover:scale-[1.02] hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-pink-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-2xl animate-float">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-blue-500 rounded-3xl animate-pulse-glow"></div>
                      <Camera className="relative w-10 h-10 text-white drop-shadow-lg" />
                    </div>
                    <p className="mb-3 text-xl font-bold gradient-text">
                      ✨ Click to upload your magical moment
                    </p>
                    <p className="text-base text-gray-600 font-medium">PNG, JPG or GIF • Up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>

            {/* Thought Input */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-xl font-bold gradient-text">
                  Your Thoughts
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setUseVoice(!useVoice)}
                    className={`relative flex items-center space-x-3 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      useVoice 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-glow' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <Mic className="w-5 h-5" />
                    <span>{useVoice ? 'Voice Mode' : 'Use Voice'}</span>
                    {useVoice && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl animate-pulse opacity-50"></div>
                    )}
                  </button>
                </div>
              </div>
              
              {useVoice ? (
                <div className="space-y-6">
                  <VoiceRecorder onTranscription={handleVoiceTranscription} />
                  {thought && (
                    <div className="relative bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-blue-200/50 shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl animate-pulse"></div>
                      <h4 className="relative text-xl font-bold gradient-text mb-4">✨ Voice Transcription:</h4>
                      <p className="relative text-blue-800 leading-relaxed text-lg font-medium">{thought}</p>
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="✨ What insights, challenges, or breakthroughs did you experience today? How can you build on this for tomorrow?"
                  rows={10}
                  className="w-full px-8 py-6 border-3 border-gray-200 rounded-3xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 resize-none text-lg leading-relaxed transition-all duration-300 shadow-inner bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium"
                />
              )}
            </div>

            {/* Structured Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Gratitude */}
              <div className="space-y-4">
                <label className="block text-lg font-bold gradient-text">🙏 Gratitude</label>
                {gratitudeItems.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(gratitudeItems, setGratitudeItems, index, e.target.value)}
                    placeholder="What are you grateful for?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80"
                  />
                ))}
              </div>

              {/* Goals */}
              <div className="space-y-4">
                <label className="block text-lg font-bold gradient-text">🎯 Goals</label>
                {goals.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(goals, setGoals, index, e.target.value)}
                    placeholder="What goals are you working on?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80"
                  />
                ))}
              </div>

              {/* Achievements */}
              <div className="space-y-4">
                <label className="block text-lg font-bold gradient-text">🏆 Achievements</label>
                {achievements.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(achievements, setAchievements, index, e.target.value)}
                    placeholder="What did you accomplish?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80"
                  />
                ))}
              </div>

              {/* Challenges */}
              <div className="space-y-4">
                <label className="block text-lg font-bold gradient-text">⚡ Challenges</label>
                {challenges.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(challenges, setChallenges, index, e.target.value)}
                    placeholder="What challenges did you face?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80"
                  />
                ))}
              </div>

              {/* Learnings */}
              <div className="space-y-4">
                <label className="block text-lg font-bold gradient-text">💡 Learnings</label>
                {learnings.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(learnings, setLearnings, index, e.target.value)}
                    placeholder="What did you learn?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80"
                  />
                ))}
              </div>

              {/* Action Items */}
              <div className="space-y-4">
                <label className="block text-lg font-bold gradient-text">📋 Action Items</label>
                {actionItems.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => updateListItem(actionItems, setActionItems, index, e.target.value)}
                    placeholder="What will you do next?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 bg-white/80"
                  />
                ))}
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!photo || !thought.trim() || isProcessing}
              className="relative w-full flex items-center justify-center space-x-4 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-6 px-10 rounded-3xl font-black text-xl hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transform overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-600/20 animate-shimmer"></div>
              {isProcessing ? (
                <>
                  <Sparkles className="relative w-8 h-8 animate-spin text-yellow-300" />
                  <span className="relative">✨ AI is analyzing your professional insights...</span>
                </>
              ) : (
                <>
                  <Save className="relative w-8 h-8" />
                  <span className="relative">🌟 Save My Professional Reflection</span>
                </>
              )}
            </button>

            {!canCreate && (
              <div className="mt-8 p-8 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm border-3 border-amber-300 rounded-3xl shadow-xl">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                  <p className="text-amber-800 font-bold text-lg">
                    ✨ One professional reflection per day. Return tomorrow for continued growth!
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}