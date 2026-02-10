
import React from 'react';
import { UserRole } from '../types.ts';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role?: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, role = UserRole.PATIENT }) => {
  const isProfessional = role === UserRole.DOCTOR || role === UserRole.THERAPIST;

  const patientNav = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'medicine-tracker', label: 'Medicine Cabinet', icon: '💊' },
    { id: 'glow-tracker', label: 'Skin Check', icon: '✨' },
    { id: 'triage', label: 'Symptom Triage', icon: '🔍' },
    { id: 'image-check', label: 'DIY Remedies', icon: '📸' },
    { id: 'doctors', label: 'Find Doctor', icon: '👨‍⚕️' },
    { id: 'tracker', label: 'Health Tracker', icon: '📈' },
    { id: 'stress', label: 'Stress Relief', icon: '🧘' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const professionalNav = [
    { id: 'dashboard', label: 'Practice Home', icon: '🏥' },
    { id: 'patients', label: 'My Patients', icon: '👥' },
    { id: 'calendar', label: 'Schedule', icon: '📅' },
    { id: 'prescriptions', label: 'E-Pharmacy', icon: '💊' },
    { id: 'network', label: 'Network', icon: '🌐' },
    { id: 'insights', label: 'Practice Insights', icon: '📊' },
    { id: 'stress', label: 'MD Wellness', icon: '🧘' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const navItems = isProfessional ? professionalNav : patientNav;

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center shadow-sm flex-shrink-0">
               <span className="text-xl font-black text-pink-500">VM</span>
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none truncate">VitaMind</h1>
              <p className="text-[7px] text-slate-400 uppercase tracking-widest font-black italic mt-1 truncate">Your Companion</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className={`text-xl mr-3 ${activeTab === item.id ? 'opacity-100' : 'opacity-60'}`}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Session Status</p>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <p className="text-xs font-bold text-slate-700">Secure & Active</p>
            </div>
          </div>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.id ? 'text-slate-900' : 'text-slate-400'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
