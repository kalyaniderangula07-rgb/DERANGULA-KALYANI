
import React, { useState, useEffect } from 'react';
import { User, UserRole, Medication, Notification, NotificationType } from './types.ts';

// Component Imports
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import Auth from './components/Auth.tsx';
import SymptomTriage from './components/SymptomTriage.tsx';
import ImageCheck from './components/ImageCheck.tsx';
import DoctorDiscovery from './components/DoctorDiscovery.tsx';
import HealthTracker from './components/HealthTracker.tsx';
import StressSupport from './components/StressSupport.tsx';
import Profile from './components/Profile.tsx';
import PrescriptionReader from './components/PrescriptionReader.tsx';
import DoctorDashboard from './components/DoctorDashboard.tsx';
import MedicineTracker from './components/MedicineTracker.tsx';
import GlowTracker from './components/GlowTracker.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.PATIENT);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to VitaMind',
      message: 'Your journey to holistic health starts here. Explore the dashboard to get started.',
      timestamp: 'Just now',
      type: NotificationType.SUCCESS,
      read: false
    }
  ]);

  // Sync role with user when they log in
  useEffect(() => {
    if (user) {
      setUserRole(user.role);
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const addMedications = (newMeds: Medication[]) => {
    setMedications(prev => [...prev, ...newMeds]);
    const notification: Notification = {
      id: Date.now().toString(),
      title: 'Medications Added',
      message: `${newMeds.length} items added to your daily rituals.`,
      timestamp: 'Just now',
      type: NotificationType.MEDICINE,
      read: false
    };
    setNotifications(prev => [notification, ...prev]);
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    // Shared Professional Content
    if (userRole === UserRole.DOCTOR || userRole === UserRole.THERAPIST) {
      switch (activeTab) {
        case 'dashboard': return <DoctorDashboard user={user} role={userRole} />;
        case 'stress': return <StressSupport />;
        case 'profile': return <Profile user={user} role={userRole} onLogout={handleLogout} />;
        default: return <DoctorDashboard user={user} role={userRole} />;
      }
    }

    // Patient Content
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} setActiveTab={setActiveTab} />;
      case 'medicine-tracker':
        return <MedicineTracker medications={medications} toggleMedication={toggleMedication} setActiveTab={setActiveTab} />;
      case 'glow-tracker':
        return <GlowTracker medications={medications} toggleMedication={toggleMedication} setActiveTab={setActiveTab} />;
      case 'triage':
        return <SymptomTriage onComplete={() => setActiveTab('doctors')} />;
      case 'image-check':
        return <ImageCheck onComplete={() => setActiveTab('doctors')} onAddReminders={addMedications} />;
      case 'prescriptions':
        return <PrescriptionReader onConfirmed={(meds) => { addMedications(meds); setActiveTab('medicine-tracker'); }} />;
      case 'doctors':
        return <DoctorDiscovery />;
      case 'tracker':
        return <HealthTracker />;
      case 'stress':
        return <StressSupport />;
      case 'profile':
        return <Profile user={user} role={userRole} onLogout={handleLogout} />;
      default:
        return <Dashboard user={user} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} role={userRole} />
      
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Header 
          currentUser={user} 
          userRole={userRole} 
          setUserRole={setUserRole} 
          activeTab={activeTab}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <NotificationCenter 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
        notifications={notifications}
        onMarkAsRead={markNotificationRead}
      />
    </div>
  );
};

export default App;
