import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Sparkles, Heart, Star, Zap } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  onSignUp: (email: string, password: string, name: string) => void;
}

export function LoginPage({ onLogin, onSignUp }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (isLogin) {
      onLogin(email, password);
    } else {
      onSignUp(email, password, name);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse"></div>
      
      {/* Floating particles */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-float opacity-70"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-pink-400 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-20 w-5 h-5 bg-blue-400 rounded-full animate-float opacity-80" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-40 right-10 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-70" style={{ animationDelay: '0.5s' }}></div>
      
      {/* Floating icons */}
      <div className="absolute top-20 right-32 text-yellow-400 animate-float opacity-60" style={{ animationDelay: '1.5s' }}>
        <Star className="w-8 h-8" />
      </div>
      <div className="absolute bottom-32 left-32 text-pink-400 animate-float opacity-70" style={{ animationDelay: '2.5s' }}>
        <Heart className="w-6 h-6" />
      </div>
      <div className="absolute top-1/2 left-10 text-blue-400 animate-float opacity-60" style={{ animationDelay: '3s' }}>
        <Zap className="w-7 h-7" />
      </div>

      {/* Main login container */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Animated border container */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-[2rem] p-[2px] animate-pulse">
          <div className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-[2rem] h-full w-full"></div>
        </div>
        
        {/* Content */}
        <div className="relative bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="text-center pt-12 pb-8 px-8">
            <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 rounded-3xl animate-pulse-glow"></div>
              <Sparkles className="relative w-10 h-10 text-white drop-shadow-lg" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black gradient-text mb-3 tracking-tight">
              {isLogin ? 'Welcome Back!' : 'Join the Magic!'}
            </h1>
            <p className="text-gray-600 text-lg font-medium">
              {isLogin ? '✨ Continue your reflection journey' : '🌟 Start your magical journey today'}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field for signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold gradient-text">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your magical name"
                      className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 shadow-inner bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium text-lg"
                      required
                    />
                    <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold gradient-text">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-4 pl-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 shadow-inner bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium text-lg"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="block text-sm font-bold gradient-text">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-4 pl-12 pr-12 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 shadow-inner bg-white/80 backdrop-blur-sm hover:shadow-lg font-medium text-lg"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white py-4 px-8 rounded-2xl font-black text-lg hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl hover:shadow-3xl hover:scale-[1.02] transform overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-500/20 to-purple-600/20 animate-shimmer"></div>
                {isLoading ? (
                  <>
                    <Sparkles className="relative w-6 h-6 animate-spin text-yellow-300" />
                    <span className="relative">✨ Creating Magic...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="relative w-6 h-6" />
                    <span className="relative">
                      {isLogin ? '🌟 Enter the Magic' : '✨ Start My Journey'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Toggle between login/signup */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 font-medium">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail('');
                  setPassword('');
                  setName('');
                }}
                className="mt-2 text-purple-600 hover:text-purple-800 font-bold text-lg transition-colors hover:scale-105 transform duration-300"
              >
                {isLogin ? '✨ Create Account' : '🌟 Sign In'}
              </button>
            </div>

            {/* Demo credentials */}
            {isLogin && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl border-2 border-blue-200/50 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-2xl animate-pulse"></div>
                <p className="relative text-sm text-blue-800 font-bold text-center mb-2">
                  ✨ Demo Credentials
                </p>
                <p className="relative text-xs text-blue-700 text-center">
                  Email: demo@magic.com • Password: magic123
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-specific enhancements */}
      <style jsx>{`
        @media (max-width: 640px) {
          .gradient-text {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}