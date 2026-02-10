
import React from 'react';
import { Medication } from '../types';

interface SkinCheckProps {
  medications: Medication[];
  toggleMedication: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

const SkinCheck: React.FC<SkinCheckProps> = ({ medications, toggleMedication, setActiveTab }) => {
  const glowMeds = medications.filter(m => m.category === 'Skincare' || m.category === 'Ritual');
  const takenCount = glowMeds.filter(m => m.taken).length;
  const progressPercent = glowMeds.length > 0 ? (takenCount / glowMeds.length) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-pink-600 tracking-tight">Skin Check</h2>
          <p className="text-slate-500 font-medium mt-1">Holistic wellness and natural skin rituals.</p>
        </div>
        <button 
          onClick={() => setActiveTab('image-check')}
          className="bg-pink-500 text-white px-8 py-4 rounded-2xl font-black hover:bg-pink-600 transition-all shadow-xl shadow-pink-100 flex items-center justify-center gap-2"
        >
          <span>📸</span> Capture Skin Concern
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gradient-to-br from-pink-50 to-indigo-50 p-10 rounded-[48px] border-2 border-white shadow-xl relative overflow-hidden">
             <div className="relative z-10 flex items-center justify-between">
                <div className="max-w-[180px]">
                   <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">Health Level</p>
                   <h3 className="text-5xl font-black text-slate-800">{Math.round(progressPercent)}%</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed">Complete your rituals to maintain skin vitality.</p>
                </div>
                <div className="w-32 h-32 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-5xl shadow-inner border border-white">
                  ✨
                </div>
             </div>
             <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-pink-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {glowMeds.length === 0 ? (
               <div className="col-span-full bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-100 text-center">
                 <p className="text-slate-400 font-bold mb-4">No rituals found in your studio.</p>
                 <button 
                   onClick={() => setActiveTab('image-check')}
                   className="text-pink-600 font-black text-xs uppercase tracking-widest hover:underline"
                 >
                   Use Skin Check to discover rituals
                 </button>
               </div>
            ) : (
              glowMeds.map(item => (
                <div 
                  key={item.id} 
                  className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center text-center space-y-4 ${
                    item.taken 
                    ? 'bg-pink-50/30 border-pink-100 opacity-60 scale-[0.98]' 
                    : 'bg-white border-white shadow-xl hover:border-pink-200'
                  }`}
                >
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-2 transition-all ${
                    item.taken ? 'bg-pink-100 grayscale' : 'bg-pink-50 rotate-3'
                  }`}>
                    {item.category === 'Skincare' ? '🧴' : '🌿'}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-xl leading-tight">{item.name}</p>
                    <p className="text-[10px] text-pink-500 font-black uppercase mt-1 tracking-widest">{item.time}</p>
                  </div>
                  <button 
                    onClick={() => toggleMedication(item.id)}
                    className={`w-full py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all ${
                      item.taken 
                      ? 'bg-slate-100 text-slate-400 cursor-default' 
                      : 'bg-slate-900 text-white shadow-lg shadow-slate-200 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {item.taken ? 'Ritual Complete ✨' : 'Perform Ritual'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6">Natural Wisdom</h4>
              <div className="space-y-6">
                 {[
                   { title: 'Rosemary Rinse', desc: 'Boosts circulation for scalp health.', icon: '🌿' },
                   { title: 'Ice Globes', desc: 'Calms inflammation and depuffs eyes.', icon: '❄️' },
                   { title: 'Silk Sleep', desc: 'Prevents friction-based skin irritation.', icon: '🧵' }
                 ].map((tip, idx) => (
                   <div key={idx} className="flex gap-4 group cursor-help">
                      <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-pink-50 transition-colors">{tip.icon}</div>
                      <div>
                         <p className="font-black text-slate-800 text-sm">{tip.title}</p>
                         <p className="text-xs text-slate-400 font-medium">{tip.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-indigo-600 text-white p-8 rounded-[40px] shadow-xl shadow-indigo-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Daily Mantra</p>
              <p className="text-xl font-medium italic leading-relaxed">
                "My skin is a reflection of my inner peace. I treat it with kindness today."
              </p>
              <div className="mt-8 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center text-xs">🧘</div>
                 <p className="text-[10px] font-black uppercase tracking-widest">Peace Activated</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SkinCheck;
