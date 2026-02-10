
import React from 'react';
import { User } from '../types';

interface DashboardProps {
  user: User;
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, setActiveTab }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-1000">
      {/* VITA MIND LOGO RECONSTRUCTION */}
      <div className="mb-12 relative group cursor-default">
        <div className="flex items-center gap-6">
           {/* Head & Heart & Tech & Nature Icon Composite */}
           <div className="relative w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" /> {/* Cyan */}
                    <stop offset="50%" stopColor="#db2777" /> {/* Pink */}
                    <stop offset="100%" stopColor="#fbbf24" /> {/* Orange */}
                  </linearGradient>
                </defs>
                {/* Simplified heart/head shape representing the logo */}
                <path 
                  d="M100 180 C100 180 20 120 20 70 C20 40 45 20 70 20 C85 20 95 30 100 40 C105 30 115 20 130 20 C155 20 180 40 180 70 C180 120 100 180 100 180 Z" 
                  fill="url(#mainGradient)" 
                />
                {/* Profile silhouette cutout effect */}
                <path d="M20 70 Q20 10 70 20 L70 50 L40 70 Z" fill="white" fillOpacity="0.2" />
                {/* Circuit lines simplified */}
                <path d="M100 60 L100 120 M80 80 L100 100 M120 80 L100 100" stroke="white" strokeWidth="4" strokeLinecap="round" />
                <circle cx="100" cy="100" r="5" fill="white" />
                <circle cx="80" cy="80" r="4" fill="white" />
                <circle cx="120" cy="80" r="4" fill="white" />
                {/* Leaf simplified */}
                <path d="M100 170 C140 160 160 120 150 100 C130 120 100 130 100 170 Z" fill="#4ade80" />
                <path d="M130 50 L145 50 M137.5 42.5 L137.5 57.5" stroke="white" strokeWidth="4" strokeLinecap="round" />
              </svg>
           </div>
           
           <div className="flex flex-col items-start text-left">
              <h1 className="text-6xl md:text-8xl font-black text-slate-800 tracking-tighter leading-none">
                Vita<span className="text-pink-600">Mind</span>
              </h1>
              <p className="text-xl md:text-2xl font-black text-pink-500 italic mt-2 tracking-tight">Because You Matter.</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400">{user.name.split(' ')[0]}!</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed px-4">
            Today is a beautiful day to nurture your well-being. Your journey to a balanced life continues here.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { label: 'Check Health', tab: 'tracker', icon: '📈' },
            { label: 'Daily Meds', tab: 'medicine-tracker', icon: '💊' },
            { label: 'DIY Remedies', tab: 'image-check', icon: '📸' },
            { label: 'Stress Relief', tab: 'stress', icon: '🧘' }
          ].map(item => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className="p-6 bg-white border border-slate-100 rounded-[32px] shadow-sm hover:shadow-xl hover:border-pink-200 transition-all group active:scale-95 flex flex-col items-center justify-center gap-3"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-pink-600">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-10 text-center opacity-30 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">VitaMind Ecosystem • Version 2.0</p>
      </div>
    </div>
  );
};

export default Dashboard;
