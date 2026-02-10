import React, { useState, useEffect } from 'react';
import { UserRole, Medication, User, Notification, NotificationType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DoctorDashboard from './components/DoctorDashboard';
import SymptomTriage from './components/SymptomTriage';
import ImageCheck from './components/ImageCheck';
import PrescriptionReader from './components/PrescriptionReader';
import DoctorDiscovery from './components/DoctorDiscovery';
import HealthTracker from './components/HealthTracker';
import StressSupport from './components/StressSupport';
import Profile from './components/Profile';
import Auth from './components/Auth';
import MedicineTracker from './components/MedicineTracker';
import SkinCheck from './components/GlowTracker';
import NotificationCenter from './components/NotificationCenter';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('whenever_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(currentUser?.role || UserRole.PATIENT);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Water Reminder',
      message: "Time for a quick refresh! You're 2 glasses away from your goal.",
      timestamp: '2 mins ago',
      type: NotificationType.INFO,
      read: false
    },
    {
      id: '2',
      title: 'Ritual Complete',
      message: 'You performed your Rosemary Rinse. Your skin vitality increased by 5%.',
      timestamp: '1 hour ago',
      type: NotificationType.SUCCESS,
      read: false
    },
    {
      id: '3',
      title: 'Consultation Soon',
      message: 'Your call with Dr. Priya Sharma starts in 15 minutes.',
      timestamp: '3 hours ago',
      type: NotificationType.ALERT,
      read: true
    }
  ]);

  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role || UserRole.PATIENT);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`whenever_meds_${currentUser.id}`);
      setMedications(saved ? JSON.parse(saved) : []);
    } else {
      setMedications([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`whenever_meds_${currentUser.id}`, JSON.stringify(medications));
    }
  }, [medications, currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setUserRole(user.role);
    localStorage.setItem('whenever_current_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('whenever_current_user');
    setActiveTab('dashboard');
  };

  const addMedications = (newMeds: Medication[]) => {
    setMedications(prev => {
      return [...prev, ...newMeds.map(m => ({ 
        ...m, 
        id: m.id || (Date.now() + Math.random().toString()) 
      }))];
    });
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!currentUser) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const isProfessional = userRole === UserRole.DOCTOR || userRole === UserRole.THERAPIST;

    switch (activeTab) {
      case 'dashboard': 
        return isProfessional 
          ? <DoctorDashboard user={currentUser} role={userRole} /> 
          : <Dashboard user={currentUser} setActiveTab={setActiveTab} />;
      case 'medicine-tracker':
        return <MedicineTracker medications={medications} toggleMedication={toggleMedication} setActiveTab={setActiveTab} />;
      case 'glow-tracker':
        return <SkinCheck medications={medications} toggleMedication={toggleMedication} setActiveTab={setActiveTab} />;
      case 'triage': return <SymptomTriage onComplete={() => setActiveTab('doctors')} />;
      case 'image-check': return <ImageCheck onComplete={() => setActiveTab('doctors')} onAddReminders={addMedications} />;
      case 'prescriptions': return <PrescriptionReader onConfirmed={(meds) => { addMedications(meds); setActiveTab('medicine-tracker'); }} />;
      case 'doctors': return <DoctorDiscovery />;
      case 'tracker': return <HealthTracker />;
      case 'stress': return <StressSupport />;
      case 'profile': return <Profile user={currentUser} role={userRole} onLogout={handleLogout} />;
      default: return isProfessional 
        ? <DoctorDashboard user={currentUser} role={userRole} />
        : <Dashboard user={currentUser} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          currentUser={currentUser}
          userRole={userRole} 
          setUserRole={setUserRole} 
          activeTab={activeTab}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          unreadCount={unreadCount}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 selection:bg-pink-100 selection:text-pink-600 scrollbar-hide">
          <div className="max-w-6xl mx-auto pb-20 md:pb-0">
            {renderContent()}
          </div>
        </main>
      </div>

      <NotificationCenter 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationRead}
      />
    </div>
  );
};

export default App;