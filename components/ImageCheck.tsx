import React, { useState, useRef } from 'react';
import { performImageCheck, generateRemedyImage } from '../geminiService';
import { TriageResult, Severity, RemedyItem, Medication } from '../types';

interface ImageCheckProps {
  onComplete: () => void;
  onAddReminders: (meds: Medication[]) => void;
}

const ImageCheck: React.FC<ImageCheckProps> = ({ onComplete, onAddReminders }) => {
  const [image, setImage] = useState<string | null>(null);
  const [followUps, setFollowUps] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [remedyImages, setRemedyImages] = useState<Record<string, string>>({});
  const [addingReminders, setAddingReminders] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await performImageCheck(image, followUps);
      setResult(data);
      
      if (data.remedyItems) {
        data.remedyItems.forEach(async (item) => {
          const imgUrl = await generateRemedyImage(item.imagePrompt);
          setRemedyImages(prev => ({ ...prev, [item.id]: imgUrl }));
        });
      }
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addReminder = (remedy: RemedyItem) => {
    const newMed: Medication = {
      id: `remedy-${Date.now()}-${remedy.id}`,
      name: remedy.name,
      dosage: "1 application",
      schedule: "Daily Ritual",
      time: remedy.timeOfDay === 'Morning' ? '08:00 AM' : '09:00 PM',
      taken: false,
      category: 'Ritual'
    };
    onAddReminders([newMed]);
    setAddingReminders(prev => ({ ...prev, [remedy.id]: true }));
  };

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case Severity.MILD: return 'bg-green-100 text-green-700';
      case Severity.MODERATE: return 'bg-yellow-100 text-yellow-700';
      case Severity.SEVERE: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      {!result ? (
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl">
          <h2 className="text-3xl font-black text-slate-800 mb-2">DIY REMEDIES</h2>
          <p className="text-slate-500 mb-8 text-lg font-medium leading-relaxed">Snapshot your concern to unlock nature's ancient homemade secrets.</p>

          <div className="space-y-8">
            {!image ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/3] border-4 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center hover:border-pink-400 hover:bg-pink-50/50 transition-all group"
              >
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-4xl">📸</span>
                </div>
                <span className="text-lg font-bold text-slate-700">Capture the Concern</span>
                <span className="text-sm text-slate-400 mt-2">Clear photo for better natural matching</span>
              </button>
            ) : (
              <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-100">
                <img src={`data:image/jpeg;base64,${image}`} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-6 right-6 bg-white/90 backdrop-blur-md w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-white text-xl"
                >
                  ✕
                </button>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-4">How does it feel?</label>
              <textarea
                value={followUps}
                onChange={(e) => setFollowUps(e.target.value)}
                placeholder="Is it itchy? When did it start? I'll look for natural remedies in your kitchen..."
                className="w-full p-6 rounded-3xl border border-slate-200 focus:ring-4 focus:ring-pink-500/10 focus:border-pink-400 outline-none transition-all resize-none h-32 text-lg"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!image || loading}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-xl hover:bg-pink-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Mixing Natural Remedies...
                </span>
              ) : 'Analyse'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-xl">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
               <div>
                  <h2 className="text-3xl font-black text-slate-800">Nature's Assessment</h2>
                  <p className="text-slate-500 font-medium">Ancient wisdom for modern healing.</p>
               </div>
               <span className={`px-6 py-2 rounded-full text-[10px] font-black ${getSeverityColor(result.severity)} uppercase tracking-widest shadow-sm`}>
                 {result.severity} Priority
               </span>
             </div>

             <div className="bg-pink-50/50 p-8 rounded-3xl border border-pink-100 mb-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-6 opacity-10 text-6xl group-hover:rotate-12 transition-transform">🌿</div>
               <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">The Wisdom Path</p>
               <p className="text-xl font-medium text-slate-800 leading-relaxed italic">"{result.guidance}"</p>
               <div className="mt-6 flex items-center space-x-3">
                 <div className="px-4 py-2 bg-white rounded-xl border border-pink-100 shadow-sm">
                   <p className="text-[10px] font-black text-pink-400 uppercase mb-1">Clinic Specialist</p>
                   <p className="font-bold text-slate-800">{result.doctorType}</p>
                 </div>
               </div>
             </div>
           </div>

           <div className="space-y-6">
             <div className="flex items-center justify-between px-4">
                <h3 className="text-2xl font-black text-slate-800">Home Apothecary</h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">100% Natural Recipes</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.remedyItems?.map((remedy) => (
                  <div key={remedy.id} className="bg-white rounded-[40px] overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all group flex flex-col">
                    <div className="aspect-square relative bg-slate-50 overflow-hidden">
                      {remedyImages[remedy.id] ? (
                        <img src={remedyImages[remedy.id]} alt={remedy.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center flex-col space-y-3">
                           <div className="w-8 h-8 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
                           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Growing Remedy...</p>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
                          {remedy.timeOfDay} Ritual
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <h4 className="text-xl font-black text-slate-800 mb-2">{remedy.name}</h4>
                      <p className="text-sm text-slate-500 mb-4 font-medium leading-relaxed">{remedy.description}</p>
                      
                      <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">How to Prepare</p>
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{remedy.instructions}</p>
                      </div>

                      <div className="mt-auto">
                        <button 
                          onClick={() => addReminder(remedy)}
                          disabled={addingReminders[remedy.id]}
                          className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            addingReminders[remedy.id] 
                            ? 'bg-green-50 text-green-600 border border-green-100' 
                            : 'bg-slate-900 text-white hover:bg-pink-600 active:scale-95 shadow-lg'
                          }`}
                        >
                          {addingReminders[remedy.id] ? (
                            <><span>✓</span> Recipe Added</>
                          ) : (
                            <><span>✨</span> Add to Daily Rituals</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onComplete}
              className="flex-1 bg-pink-600 text-white py-4 rounded-[32px] font-black text-lg hover:bg-pink-700 transition-all shadow-xl"
            >
              Book Specialist
            </button>
            <button 
              onClick={() => { setResult(null); setRemedyImages({}); setAddingReminders({}); }}
              className="flex-1 bg-white border-2 border-slate-100 py-4 rounded-[32px] font-black text-lg hover:bg-slate-50 transition-all"
            >
              Scan Another Concern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCheck;