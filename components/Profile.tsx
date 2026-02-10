
import React from 'react';
import { UserRole, User } from '../types';
import { MOCK_DOCTORS } from '../constants';

interface ProfileProps {
  user: User;
  role: UserRole;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, role, onLogout }) => {
  const historyItems = [
    { event: 'Flu Checkup', date: 'Oct 12, 2024', doctor: MOCK_DOCTORS[0] }, 
    { event: 'Skin Assessment', date: 'Aug 05, 2024', doctor: MOCK_DOCTORS[2] }, 
    { event: 'Routine Test', date: 'May 20, 2024', doctor: { name: 'City Lab', image: 'https://picsum.photos/seed/lab/100/100' } }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
        <div className="h-32 w-32 rounded-[32px] bg-indigo-50 flex items-center justify-center text-5xl border-4 border-white shadow-xl overflow-hidden">
          <img src={user.avatar || `https://picsum.sh/seed/${user.email}/300/300`} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800">{user.name}</h2>
          <p className="text-blue-600 font-black uppercase tracking-widest text-[10px] mt-1">{role} ACCOUNT • {user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</p>
                <p className="font-bold text-slate-800">B Positive</p>
            </div>
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className="font-bold text-slate-800">Active</p>
            </div>
            <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitality Score</p>
                <p className="font-bold text-green-600">82/100</p>
            </div>
          </div>
        </div>
        <div className="pt-4 md:pt-0">
          <button 
            onClick={onLogout}
            className="bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
               <span>📜</span> Medical History
            </h3>
            <div className="space-y-4">
                {historyItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-[24px] border border-slate-100 transition-colors group">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md">
                                <img src={item.doctor.image} alt={item.doctor.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{item.event}</p>
                                <p className="text-[11px] text-slate-500 font-medium">{item.date} • {item.doctor.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <section className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-2">
               <span>🚨</span> Emergency Contacts
            </h3>
            <div className="space-y-4">
                {[
                    { name: 'Ramesh Iyer', relation: 'Father', phone: '+91 98200 12345' },
                    { name: 'Sunita Iyer', relation: 'Mother', phone: '+91 98200 54321' }
                ].map((contact, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 border border-slate-100 rounded-[24px] hover:border-blue-200 transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-xl shadow-inner">👤</div>
                            <div>
                                <p className="font-black text-slate-800">{contact.name}</p>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{contact.relation}</p>
                            </div>
                        </div>
                        <a href={`tel:${contact.phone}`} className="h-10 w-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm">
                            📞
                        </a>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
