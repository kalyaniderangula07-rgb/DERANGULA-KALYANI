
import React from 'react';
import { UserRole, User } from '../types.ts';

interface HeaderProps {
  currentUser: User;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  onOpenNotifications: () => void;
  unreadCount: number;
}

const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  userRole, 
  setUserRole, 
  activeTab,
  onOpenNotifications,
  unreadCount
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="md:hidden">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">VitaMind</h1>
        </div>
        <div className="hidden md:flex items-center text-sm text-slate-500">
          <span className="font-bold">VitaMind</span>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-slate-900 font-black capitalize tracking-tight">{activeTab.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all group"
          aria-label="View notifications"
        >
          <span className="text-xl group-hover:scale-110 transition-transform">🔔</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-in zoom-in">
              {unreadCount}
            </span>
          )}
        </button>

        <select 
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as UserRole)}
          className="bg-slate-100 border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-4 py-2 text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors outline-none ring-offset-2 focus:ring-2 focus:ring-pink-500"
        >
          <option value={UserRole.PATIENT}>Patient</option>
          <option value={UserRole.DOCTOR}>Doctor</option>
          <option value={UserRole.THERAPIST}>Therapist</option>
        </select>
        
        <div className="h-10 w-10 rounded-xl bg-pink-100 flex items-center justify-center border-2 border-white shadow-md ring-1 ring-slate-200 overflow-hidden">
           <img src={currentUser.avatar || `https://picsum.photos/seed/${currentUser.email}/100/100`} alt={currentUser.name} className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Header;
