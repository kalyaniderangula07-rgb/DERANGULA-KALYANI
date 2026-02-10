
import React, { useState, useEffect, useRef } from 'react';
import { getWellnessFeedback, generateHealthToDos } from '../services/geminiService';

const HealthTracker: React.FC = () => {
  const [stats, setStats] = useState({
    sleepHours: 7,
    screenTime: 5,
    waterIntake: 2,
    mood: 'Good',
    steps: 6000
  });
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('Loading daily insights...');
  const [toDos, setToDos] = useState<{id: string, name: string, icon: string, category: string, completed?: boolean}[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    // Simple logic for health score
    const s = Math.round(
        (stats.sleepHours / 8 * 25) + 
        ((12 - stats.screenTime) / 12 * 25) + 
        (stats.waterIntake / 3 * 25) + 
        (stats.steps / 10000 * 25)
    );
    const finalScore = Math.min(Math.max(s, 0), 100);
    setScore(finalScore);
    
    // Get AI feedback
    getWellnessFeedback(finalScore, stats).then(setFeedback);

    // Debounce AI To-Do generation to avoid excessive API calls
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
        setIsAnalyzing(true);
        generateHealthToDos(stats).then(newToDos => {
            setToDos(newToDos);
            setIsAnalyzing(false);
        });
    }, 1500);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [stats]);

  const toggleToDo = (id: string) => {
    setToDos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Wellness Score Header */}
      <div className="bg-white p-8 rounded-[50px] border border-slate-100 shadow-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
            <div className="h-full bg-blue-500 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${score}%` }}></div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Daily Vitality Score</p>
        <h2 className="text-8xl font-black text-slate-800 my-4 tracking-tighter">{score}</h2>
        <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100 max-w-xl mx-auto backdrop-blur-sm">
            <p className="text-lg font-medium text-blue-700 italic leading-relaxed">"{feedback}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Stats Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center text-sm uppercase tracking-widest">
                        <span className="text-2xl mr-3">💤</span> Sleep Tracker
                    </h3>
                    <input 
                        type="range" min="0" max="12" step="0.5"
                        value={stats.sleepHours}
                        onChange={(e) => setStats({...stats, sleepHours: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between mt-4 items-center">
                        <span className="text-[10px] font-black text-slate-300 uppercase">0H</span>
                        <span className="text-2xl font-black text-slate-800">{stats.sleepHours} hrs</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase">12H</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center text-sm uppercase tracking-widest">
                        <span className="text-2xl mr-3">💧</span> Water Intake
                    </h3>
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={() => setStats({...stats, waterIntake: Math.max(0, stats.waterIntake - 0.25)})}
                            className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 text-2xl font-black hover:bg-slate-100 active:scale-90 transition-all"
                        >
                            -
                        </button>
                        <div className="flex-1 text-center">
                            <p className="text-3xl font-black text-slate-800">{stats.waterIntake}L</p>
                            <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mt-1">Target: 3.0L</p>
                        </div>
                        <button 
                            onClick={() => setStats({...stats, waterIntake: stats.waterIntake + 0.25})}
                            className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 text-2xl font-black hover:bg-blue-100 active:scale-90 transition-all"
                        >
                            +
                        </button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center text-sm uppercase tracking-widest">
                        <span className="text-2xl mr-3">📱</span> Screen Time
                    </h3>
                    <input 
                        type="range" min="0" max="15" step="1"
                        value={stats.screenTime}
                        onChange={(e) => setStats({...stats, screenTime: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-orange-400"
                    />
                    <div className="flex justify-between mt-4 items-center">
                        <span className="text-[10px] font-black text-slate-300 uppercase">0H</span>
                        <span className="text-2xl font-black text-slate-800">{stats.screenTime} hrs</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase">15H+</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-black text-slate-800 mb-6 flex items-center text-sm uppercase tracking-widest">
                        <span className="text-2xl mr-3">🚶</span> Daily Steps
                    </h3>
                    <div className="relative">
                        <input 
                            type="range" min="0" max="15000" step="500"
                            value={stats.steps}
                            onChange={(e) => setStats({...stats, steps: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                        <div className="flex justify-between mt-4 items-center">
                            <span className="text-[10px] font-black text-slate-300 uppercase">0</span>
                            <span className="text-2xl font-black text-slate-800">{stats.steps.toLocaleString()}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase">15K</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* AI Health TO-DO Section */}
        <div className="space-y-6">
            <div className="flex items-center justify-between px-4">
                <h3 className="text-2xl font-black text-slate-800">Health TO DO</h3>
                {isAnalyzing && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
            </div>

            <div className="bg-slate-900 rounded-[50px] p-8 shadow-2xl relative overflow-hidden group min-h-[400px]">
                <div className="relative z-10 space-y-4">
                    {toDos.length === 0 && !isAnalyzing ? (
                        <div className="text-center py-20">
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Everything is optimized</p>
                        </div>
                    ) : (
                        toDos.map((todo) => (
                            <button
                                key={todo.id}
                                onClick={() => toggleToDo(todo.id)}
                                className={`w-full flex items-center p-5 rounded-[28px] transition-all border-2 text-left group/item ${
                                    todo.completed 
                                    ? 'bg-white/5 border-transparent opacity-40 scale-95' 
                                    : 'bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20'
                                }`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mr-4 bg-white/10 ${todo.completed ? 'grayscale' : ''}`}>
                                    {todo.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">{todo.category}</p>
                                    <p className={`font-bold text-sm ${todo.completed ? 'line-through text-slate-500' : 'text-white'}`}>{todo.name}</p>
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${todo.completed ? 'bg-green-500 border-green-500 text-white' : 'border-white/20'}`}>
                                    {todo.completed && <span className="text-[10px]">✓</span>}
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                
                <div className="mt-8 pt-6 border-t border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">AI Analyzed Recommendations</p>
                </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-[40px] border border-indigo-100">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">💡</span>
                    <h4 className="font-black text-indigo-900 text-sm uppercase tracking-widest">Health Tip</h4>
                </div>
                <p className="text-indigo-800 font-medium italic text-sm leading-relaxed">
                    "Your habits define your future self. Small shifts in hydration and movement today lead to massive vitality tomorrow."
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
