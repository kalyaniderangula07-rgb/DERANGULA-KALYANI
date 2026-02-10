import { Doctor, Appointment, PatientRecord } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Priya Sharma',
    specialization: 'General Physician',
    clinic: 'City Health Clinic',
    distance: '0.8 km',
    rating: 4.8,
    image: 'https://picsum.photos/seed/doctor1/200/200',
    availability: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    onlineConsultation: true
  },
  {
    id: 'd2',
    name: 'Dr. Rajesh Khanna',
    specialization: 'Orthopedic Surgeon',
    clinic: 'Orthocare Hospital',
    distance: '2.5 km',
    rating: 4.9,
    image: 'https://picsum.photos/seed/doctor2/200/200',
    availability: ['10:00 AM', '01:00 PM', '03:00 PM'],
    onlineConsultation: false
  },
  {
    id: 'd3',
    name: 'Dr. Anjali Mehta',
    specialization: 'Dermatologist',
    clinic: 'Skin & Aesthetics Center',
    distance: '1.2 km',
    rating: 4.7,
    image: 'https://picsum.photos/seed/doctor3/200/200',
    availability: ['08:30 AM', '12:00 PM', '05:00 PM'],
    onlineConsultation: true
  },
  {
    id: 'd4',
    name: 'Dr. Arjun Kapoor',
    specialization: 'Therapist',
    clinic: 'Mind Balance Studio',
    distance: '1.5 km',
    rating: 5.0,
    image: 'https://picsum.photos/seed/doctor4/200/200',
    availability: ['11:00 AM', '03:00 PM', '06:00 PM'],
    onlineConsultation: true
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Aarav Smith',
    patientAvatar: 'https://i.pravatar.cc/150?u=aarav',
    doctorId: 'd1',
    doctorName: 'Dr. Priya Sharma',
    date: 'Today',
    time: '10:30 AM',
    type: 'Online',
    status: 'Upcoming'
  },
  {
    id: 'a2',
    patientId: 'p2',
    patientName: 'Ishani Gupta',
    patientAvatar: 'https://i.pravatar.cc/150?u=ishani',
    doctorId: 'd1',
    doctorName: 'Dr. Priya Sharma',
    date: 'Today',
    time: '12:00 PM',
    type: 'In-person',
    status: 'Upcoming'
  }
];

export const MOCK_PATIENTS: PatientRecord[] = [
  {
    id: 'p1',
    name: 'Aarav Smith',
    age: 28,
    gender: 'Male',
    lastVisit: 'Oct 20, 2024',
    condition: 'Chronic Allergies',
    avatar: 'https://i.pravatar.cc/150?u=aarav'
  }
];

export const SPECIALIZATIONS = [
  'General Physician',
  'Pediatrician',
  'Dermatologist',
  'Orthopedic Surgeon',
  'Cardiologist',
  'Therapist'
];