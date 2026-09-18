// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const displayName = fullName.trim();
    login(email || 'user@example.com', password, displayName);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8f4fc] flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-stone-900 relative overflow-hidden">
      {/* Background Ambient Mesh */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-fuchsia-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white/20" />
            </div>
            <span className="font-extrabold text-2xl text-stone-900 tracking-tight">SkillSync</span>
          </Link>
          <p className="text-xs text-stone-500 font-medium">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to access your workspace'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#fbf7fd] rounded-3xl p-6 sm:p-8 border-2 border-purple-200/80 hover:border-purple-400 shadow-xl space-y-6 transition-all">
          {/* Sign In / Sign Up Tab Toggle */}
          <div className="flex bg-purple-100/70 p-1 rounded-xl text-xs font-bold border border-purple-200/80">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isSignUp ? 'bg-purple-600 text-white shadow-md' : 'text-stone-600 hover:text-purple-700 hover:bg-purple-200/50'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isSignUp ? 'bg-purple-600 text-white shadow-md' : 'text-stone-600 hover:text-purple-700 hover:bg-purple-200/50'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-purple-200 text-stone-900 text-xs focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 placeholder:text-stone-400 shadow-xs transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-purple-200 text-stone-900 text-xs focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 placeholder:text-stone-400 shadow-xs transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-purple-200 text-stone-900 text-xs focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 placeholder:text-stone-400 shadow-xs transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {isSignUp ? 'Create Account' : 'Sign In to Workspace'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Sign In Option */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-200/80"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold text-stone-500">
              <span className="bg-[#fbf7fd] px-2 text-stone-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => { login('user@example.com', 'pass', ''); navigate('/dashboard'); }}
              className="py-2.5 px-3 rounded-xl border border-purple-300/80 bg-purple-50/80 hover:bg-purple-100 text-xs font-bold text-purple-700 flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              ⚡ Quick Demo Sign In
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center pt-2 border-t border-purple-200/80">
            <Link to="/" className="text-xs font-semibold text-stone-500 hover:text-purple-700">
              ← Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
