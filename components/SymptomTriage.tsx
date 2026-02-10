import React, { useState, useEffect, useRef } from 'react';
import { createTriageChat, performTriage } from '../geminiService';
import { TriageResult, Severity } from '../types';
import { Chat } from '@google/genai';

interface Message { text: string; sender: 'user' | 'bot'; }
interface SymptomTriageProps { onComplete: () => void; }

const SymptomTriage: React.FC<SymptomTriageProps> = ({ onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hello! I'm your Whenever Triage Assistant. 🛡️ Describe any symptoms you're having.", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const chatInstance = useRef<Chat | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputText.trim();
    if (!text || isTyping || result) return;

    setMessages(prev => [...prev, { text, sender: 'user' }]);
    setInputText('');
    setIsTyping(true);

    try {
      if (!chatInstance.current) chatInstance.current = createTriageChat();
      const response = await chatInstance.current.sendMessage({ message: text });
      const botText = response.text || "Tell me more.";
      setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
      if (botText.toLowerCase().includes('specialist') || messages.length > 5) {
         const summary = await performTriage(messages.map(m => m.text).join('\n') + '\n' + text);
         setResult(summary);
      }
    } catch (error) { console.error(error); } finally { setIsTyping(false); }
  };

  return (
    <div className="max-w-3xl mx-auto h-[750px] flex flex-col bg-white rounded-[50px] border border-slate-100 shadow-2xl overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-white/80 flex justify-between items-center">
         <h3 className="text-2xl font-black text-slate-800">Triage Assistant</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
         {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[85%] px-6 py-4 rounded-[32px] font-medium shadow-sm ${msg.sender === 'user' ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border rounded-tl-none'}`}>{msg.text}</div>
            </div>
         ))}
         {result && (
           <div className="bg-white p-8 rounded-[40px] border border-pink-100 shadow-2xl animate-in zoom-in space-y-6">
              <p className="text-xl font-black text-slate-800">Specialist: {result.doctorType}</p>
              <p className="text-lg italic leading-relaxed">"{result.guidance}"</p>
              <button onClick={onComplete} className="w-full bg-pink-600 text-white py-4 rounded-3xl font-black uppercase">Find {result.doctorType}</button>
           </div>
         )}
         <div ref={chatEndRef} />
      </div>
      {!result && (
        <form onSubmit={handleSendMessage} className="p-8 bg-white border-t flex gap-4">
           <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Describe your concern..." className="flex-1 bg-slate-100 px-6 py-4 rounded-[32px] outline-none" />
           <button type="submit" className="w-14 h-14 bg-pink-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-pink-700 transition-colors">🚀</button>
        </form>
      )}
    </div>
  );
};

export default SymptomTriage;