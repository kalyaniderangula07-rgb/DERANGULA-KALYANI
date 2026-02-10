
import React from 'react';
import { UserRole } from '../types';

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
    { id: 'glow-tracker', label: 'Glow Studio', icon: '✨' },
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
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-pink-500 to-orange-400 flex items-center justify-center text-white font-black text-xs">VM</div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter">VitaMind</h1>
          </div>
          <p className="text-[9px] text-pink-500 mt-1 uppercase tracking-widest font-black italic">
            Because You Matter.
          </p>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-pink-50 text-pink-600 shadow-sm shadow-pink-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-900 text-white p-4 rounded-2xl">
            <p className="text-xs font-medium opacity-70">Support Status</p>
            <div className="flex items-center mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <p className="text-sm font-bold">Secure & Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1 flex justify-around items-center z-50">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.id ? 'text-pink-600' : 'text-slate-400'
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
