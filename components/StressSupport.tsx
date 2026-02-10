
import React, { useState, useEffect, useRef } from 'react';
import { createFriendlyChat } from '../services/geminiService';
import { Chat } from '@google/genai';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const StressSupport: React.FC = () => {
  // Breathing Exercise State
  const [exerciseActive, setExerciseActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Chat State
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I am your Friendly Listener. 💖 I am here for you. How do you feel right now?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (exerciseActive) {
      interval = setInterval(() => {
        setTimer(prev => {
            if (prev === 4) {
                if (phase === 'Inhale') setPhase('Hold');
                else if (phase === 'Hold') setPhase('Exhale');
                else if (phase === 'Exhale') setPhase('Inhale');
                return 0;
            }
            return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [exerciseActive, phase]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const startExercise = () => {
    setExerciseActive(true);
    setTimer(0);
    setPhase('Inhale');
  };

  const stopExercise = () => {
    setExerciseActive(false);
  };

  const startChat = () => {
    if (!chatInstance.current) {
      chatInstance.current = createFriendlyChat();
    }
    setChatActive(true);
  };

  const handleSendMessage = async (text: string = inputText) => {
    const messageToSend = text.trim();
    if (!messageToSend || isTyping) return;

    const userMessage: Message = { text: messageToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      if (!chatInstance.current) {
        chatInstance.current = createFriendlyChat();
      }
      const result = await chatInstance.current.sendMessage({ message: messageToSend });
      const botText = result.text || "I am here for you. ❤️";
      const botMessage: Message = { text: botText, sender: 'bot' };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "I'm sorry, I'm having a little trouble thinking. But I am still listening with my heart. ❤️", sender: 'bot' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const MoodOption: React.FC<{ label: string; icon: string; prompt: string }> = ({ label, icon, prompt }) => (
    <button 
      onClick={() => { startChat(); handleSendMessage(prompt); }}
      className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-3xl hover:border-blue-300 hover:shadow-lg transition-all active:scale-95 group"
    >
      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </button>
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Mindful Breathing Section */}
      <section className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[40px] p-8 md:p-12 text-white text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl">🌬️</div>
        {!exerciseActive ? (
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">Take a Breath</h2>
            <p className="text-purple-100 mb-10 max-w-md mx-auto text-lg font-medium">Just 2 minutes of calm can change your whole day.</p>
            <button 
              onClick={startExercise}
              className="bg-white text-purple-600 px-12 py-5 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-purple-900/20"
            >
              Start Breathing
            </button>
          </div>
        ) : (
          <div className="py-6 relative z-10">
            <div className={`w-56 h-56 rounded-full border-[12px] border-white/20 mx-auto flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${phase === 'Inhale' ? 'scale-125 bg-white/10' : phase === 'Exhale' ? 'scale-90 bg-white/5' : 'scale-110'}`}>
                <p className="text-4xl font-black">{phase}</p>
                <p className="text-lg opacity-60 mt-2 font-black">{4 - timer}s</p>
            </div>
            <button 
              onClick={stopExercise}
              className="mt-14 bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/30 transition-all"
            >
              End Session
            </button>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Friendly Listener Chatbot */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px] relative">
             <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <div className="text-3xl p-3 bg-pink-50 rounded-2xl">🤝</div>
                    <div>
                        <h3 className="font-black text-slate-800">Friendly Listener</h3>
                        <div className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Always here for you</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/20">
                {!chatActive ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                    <div className="max-w-xs">
                        <p className="text-slate-600 font-bold text-xl mb-2">Feeling overwhelmed?</p>
                        <p className="text-slate-400 font-medium text-sm leading-relaxed italic">I use small, sweet words to make you feel safe. 💖</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 w-full px-4">
                        <MoodOption label="Tired" icon="😴" prompt="I am so tired today." />
                        <MoodOption label="Sad" icon="😢" prompt="I feel a bit sad." />
                        <MoodOption label="Worried" icon="😟" prompt="I am worried about something." />
                        <MoodOption label="Lonely" icon="🍃" prompt="I feel a bit lonely." />
                    </div>

                    <button 
                      onClick={startChat}
                      className="bg-slate-900 text-white px-10 py-5 rounded-[28px] font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200 uppercase tracking-widest"
                    >
                      Just Talk to Me
                    </button>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] px-6 py-4 rounded-[32px] text-base font-medium leading-relaxed shadow-sm ${
                          msg.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white border border-slate-100 px-6 py-4 rounded-[32px] rounded-tl-none shadow-sm">
                           <div className="flex space-x-1.5">
                              <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                              <div className="w-2 h-2 bg-slate-200 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                           </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
            </div>

            {chatActive && (
              <div className="p-6 bg-white border-t border-slate-100">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex items-center space-x-3 bg-slate-100 rounded-[32px] p-2 pr-4 border border-transparent focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-lg transition-all"
                >
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tell me what's on your mind..."
                    className="flex-1 bg-transparent border-none outline-none px-5 py-3 text-base font-medium text-slate-700"
                  />
                  <button 
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-30 transition-all active:scale-95 shadow-md"
                  >
                    <span className="text-xl rotate-45 -mt-0.5 -ml-0.5">🚀</span>
                  </button>
                </form>
              </div>
            )}
        </div>

        {/* Calm Soundscapes */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm flex flex-col">
             <div className="flex items-center space-x-4 mb-8">
                <div className="text-3xl p-3 bg-blue-50 rounded-2xl">🎧</div>
                <div>
                    <h3 className="font-black text-slate-800">Calm Sounds</h3>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Natural Echoes</p>
                </div>
            </div>
            <div className="space-y-4">
                {[
                  { name: 'Rain on Roof', icon: '🌧️', color: 'blue' },
                  { name: 'Forest Birds', icon: '🐦', color: 'green' },
                  { name: 'Warm Fire', icon: '🔥', color: 'orange' },
                  { name: 'Deep Sea', icon: '🌊', color: 'indigo' }
                ].map(sound => (
                    <button key={sound.name} className="w-full flex items-center justify-between p-5 rounded-[28px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all group">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl group-hover:scale-125 transition-transform">{sound.icon}</span>
                          <span className="text-sm font-black text-slate-700">{sound.name}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                          <span className="text-slate-300 group-hover:text-blue-500 text-xs transition-colors">▶</span>
                        </div>
                    </button>
                ))}
            </div>
            <div className="mt-8 p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 flex-1 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-1 bg-indigo-200 rounded-full"></div>
                  <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Your Calm Tip</p>
                </div>
                <p className="text-lg text-indigo-900 font-medium italic leading-relaxed">"Close your eyes. Put your hands on your heart. You are safe here."</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StressSupport;
