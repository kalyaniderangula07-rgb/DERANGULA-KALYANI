import React from 'react';
import { Notification, NotificationType } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose, notifications, onMarkAsRead }) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS: return '✨';
      case NotificationType.ALERT: return '🚨';
      case NotificationType.MEDICINE: return '💊';
      default: return '🔔';
    }
  };

  const getBgColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.SUCCESS: return 'bg-pink-50 text-pink-500';
      case NotificationType.ALERT: return 'bg-rose-50 text-rose-500';
      case NotificationType.MEDICINE: return 'bg-blue-50 text-blue-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-in-out border-l border-pink-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="p-8 border-b border-pink-50 flex items-center justify-between bg-white/80 backdrop-blur-md">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Activity</h2>
              <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mt-1">Updates & Alerts</p>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-100 transition-all active:scale-90"
            >
              ✕
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                <span className="text-6xl mb-4">🌙</span>
                <p className="font-bold text-slate-400">Quiet for now.</p>
                <p className="text-[10px] uppercase font-black tracking-widest mt-2">Check back later</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div 
                  key={n.id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onClick={() => onMarkAsRead(n.id)}
                  className={`p-5 rounded-[32px] border transition-all animate-in slide-in-from-right-8 cursor-pointer group ${
                    n.read 
                    ? 'bg-white border-slate-50 opacity-60' 
                    : 'bg-white border-pink-50 shadow-sm hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/30'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 shrink-0 rounded-[20px] flex items-center justify-center text-xl shadow-inner ${getBgColor(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-black tracking-tight group-hover:text-pink-600 transition-colors ${n.read ? 'text-slate-600' : 'text-slate-800'}`}>
                          {n.title}
                        </h4>
                        {!n.read && <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse mt-1" />}
                      </div>
                      <p className="text-sm text-slate-400 font-medium leading-relaxed">
                        {n.message}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mt-2">
                        {n.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <footer className="p-6 border-t border-pink-50 bg-pink-50/20">
             <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-pink-600 transition-all active:scale-95 shadow-lg">
               Mark All As Seen
             </button>
          </footer>
        </div>
      </aside>
    </>
  );
};

export default NotificationCenter;