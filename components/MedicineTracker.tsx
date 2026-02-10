
import React, { useState } from 'react';
import { Medication } from '../types';

interface MedicineTrackerProps {
  medications: Medication[];
  toggleMedication: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

const MedicineTracker: React.FC<MedicineTrackerProps> = ({ medications, toggleMedication, setActiveTab }) => {
  const [reaction, setReaction] = useState<{ text: string; active: boolean }>({ text: '', active: false });
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const medicineMeds = medications.filter(m => m.category === 'Medicine');
  const takenCount = medicineMeds.filter(m => m.taken).length;
  const progressPercent = medicineMeds.length > 0 ? (takenCount / medicineMeds.length) * 100 : 0;

  const handleToggle = (id: string) => {
    const med = medicineMeds.find(m => m.id === id);
    if (med && !med.taken) {
      const reactions = ["Soft breath in...", "Peaceful choice.", "Kindness to self.", "Rest well.", "Gently done."];
      const randomText = reactions[Math.floor(Math.random() * reactions.length)];
      setReaction({ text: randomText, active: true });
      setTimeout(() => setReaction({ text: '', active: false }), 2000);
    }
    toggleMedication(id);
  };

  const handleReorder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      setOrderComplete(true);
      setTimeout(() => setOrderComplete(false), 3000);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 relative">
      {reaction.active && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-10 py-5 rounded-[40px] shadow-2xl border border-blue-100">
             <p className="text-2xl font-black text-blue-500 italic">"{reaction.text}"</p>
          </div>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800">Medicine Cabinet</h2>
          <p className="text-slate-500 font-medium mt-1">Clinical compliance and dosage management.</p>
        </div>
        <div className="flex gap-3">
            <button 
              onClick={handleReorder}
              disabled={isOrdering || medicineMeds.length === 0}
              className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {isOrdering ? '📡 Sending...' : orderComplete ? '✅ Ordered' : '🔄 Reorder All'}
            </button>
            <button onClick={() => setActiveTab('prescriptions')} className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl">Scan New</button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-6">Compliance Meter</h3>
            <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {medicineMeds.map(med => (
                <div key={med.id} className={`flex items-center p-6 rounded-[32px] border transition-all ${med.taken ? 'bg-blue-50/20 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:border-blue-200'}`}>
                  <button onClick={() => handleToggle(med.id)} className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center mr-6 ${med.taken ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-100 bg-slate-50 text-slate-300'}`}>{med.taken ? '✓' : '💊'}</button>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-lg">{med.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{med.dosage}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{med.schedule}</span>
                      {med.durationDays && <span className="text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">Day {med.currentDay} of {med.durationDays}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-800 tracking-tighter">{med.time}</p>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineTracker;
