
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('whenever_users');
    const users: User[] = usersStr ? JSON.parse(usersStr) : [];

    if (isLogin) {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        setError('No account found. Create your kingdom?');
        return;
      }
      if (user.password !== password) {
        setError('Incorrect password. Try again.');
        return;
      }
      onLogin(user);
    } else {
      if (!name || !email || !password) {
        setError('Fill in all fields to join.');
        return;
      }
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('Email already exists. Log in?');
        return;
      }

      const newUser: User = {
        id: email.toLowerCase(),
        name,
        email: email.toLowerCase(),
        password,
        role: role,
        avatar: `https://picsum.sh/seed/${email}/200/200`
      };

      users.push(newUser);
      localStorage.setItem('whenever_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-50 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-50 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-pink-500 to-orange-400 flex items-center justify-center text-white font-black text-lg shadow-xl">VM</div>
             <h1 className="text-5xl font-black text-slate-800 tracking-tighter">VitaMind</h1>
          </div>
          <p className="text-pink-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Because You Matter.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[48px] border border-slate-100 shadow-2xl p-10">
          <div className="flex bg-slate-100/50 p-1.5 rounded-[24px] mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isLogin ? 'bg-white text-pink-600 shadow-lg' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${!isLogin ? 'bg-white text-pink-600 shadow-lg' : 'text-slate-400'}`}
            >
              Join Us
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-3 gap-2">
                {[UserRole.PATIENT, UserRole.DOCTOR, UserRole.THERAPIST].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-tighter border-2 transition-all ${role === r ? 'bg-pink-600 border-pink-600 text-white shadow-md' : 'bg-slate-50 border-transparent text-slate-400'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {!isLogin && (
              <div>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none transition-all font-medium text-slate-700 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-pink-100"
                  placeholder="Full Name"
                />
              </div>
            )}

            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none transition-all font-medium text-slate-700 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-pink-100"
              placeholder="Email"
            />

            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none transition-all font-medium text-slate-700 placeholder-slate-300 focus:bg-white focus:ring-2 focus:ring-pink-100"
                placeholder="Password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-[18px] text-slate-300 hover:text-pink-500 transition-colors"
              >
                {showPassword ? '👁️' : '🕶️'}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-[10px] font-black uppercase tracking-tight text-center bg-red-50 p-3 rounded-xl border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] hover:bg-pink-600 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-pink-100/20 mt-4"
            >
              {isLogin ? 'Access Portal' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
