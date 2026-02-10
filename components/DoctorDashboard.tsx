
import React from 'react';
import { User, Appointment, PatientRecord, UserRole } from '../types';
import { MOCK_APPOINTMENTS, MOCK_PATIENTS } from '../constants';

interface DoctorDashboardProps {
  user: User;
  role: UserRole;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, role }) => {
  const appointments = MOCK_APPOINTMENTS;
  const patients = MOCK_PATIENTS;

  const stats = [
    { label: 'Total Patients', value: '142', icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { label: 'Consultations Today', value: '8', icon: '📅', color: 'bg-green-50 text-green-600' },
    { label: 'New Reports', value: '12', icon: '📝', color: 'bg-amber-50 text-amber-600' },
    { label: 'Urgent Care', value: '3', icon: '🚨', color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-br from-indigo-700 to-blue-800 rounded-[40px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2">Good Day, {user.name.split(' ')[0]}</h2>
          <p className="text-indigo-100 mb-8 text-xl">You have {appointments.filter(a => a.date === 'Today').length} appointments scheduled for today.</p>
          <div className="flex gap-4">
            <button className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all active:scale-95">Go to Calendar</button>
            <button className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-black hover:bg-white/30 transition-all active:scale-95">Clinic Settings</button>
          </div>
        </div>
        <div className="absolute -right-12 -bottom-12 opacity-10 text-[240px] rotate-12">👨‍⚕️</div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
            <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-black text-slate-800">{stat.value}</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end px-4">
            <div>
              <h3 className="text-3xl font-black text-slate-800">Queue</h3>
              <p className="text-xs text-slate-400 font-bold uppercase mt-1">Today's Appointments</p>
            </div>
            <button className="text-blue-600 font-black text-xs uppercase hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {appointments.map((appt) => (
              <div key={appt.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm">
                  <img src={appt.patientAvatar} alt={appt.patientName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-slate-800 text-lg">{appt.patientName}</h4>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${appt.type === 'Online' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                      {appt.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">{appt.notes || 'Routine consultation'}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <span className="text-lg font-black text-slate-800">{appt.time}</span>
                  <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95">
                    {appt.type === 'Online' ? 'Join Call' : 'Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patients Sidebar */}
        <div className="space-y-6">
          <div className="px-4">
            <h3 className="text-3xl font-black text-slate-800">Patients</h3>
            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Recent Records</p>
          </div>

          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-6 space-y-4">
            {patients.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-3xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                  <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-slate-800 text-sm truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{p.condition}</p>
                </div>
                <div className="text-xs font-black text-slate-300">→</div>
              </div>
            ))}
            <button className="w-full py-4 border-2 border-dashed border-slate-100 text-slate-400 font-black text-xs uppercase rounded-3xl hover:border-blue-200 hover:text-blue-500 transition-all">
              Add New Record
            </button>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] relative overflow-hidden">
            <h4 className="font-black mb-4 flex items-center text-sm"><span className="mr-3">🛡️</span> Clinical AI</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Analyzing latest reports for {patients[0].name}. Recommended action: Review lab results for Hyperthyroidism.
            </p>
            <button className="w-full bg-white/10 p-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Analyze Full Practice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
