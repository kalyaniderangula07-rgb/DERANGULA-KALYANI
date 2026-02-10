export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  THERAPIST = 'THERAPIST'
}

export enum Severity {
  MILD = 'Mild',
  MODERATE = 'Moderate',
  SEVERE = 'Severe'
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ALERT = 'ALERT',
  MEDICINE = 'MEDICINE'
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: NotificationType;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  avatar: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  clinic: string;
  distance: string;
  rating: number;
  image: string;
  availability: string[];
  onlineConsultation: boolean;
}

export interface RemedyItem {
  id: string;
  name: string;
  description: string;
  instructions: string;
  imagePrompt: string;
  timeOfDay: string;
}

export interface TriageResult {
  doctorType: string;
  severity: Severity;
  guidance: string;
  remedyItems?: RemedyItem[];
  emergencyAlert: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: string;
  time: string;
  taken: boolean;
  category: 'Medicine' | 'Skincare' | 'Ritual';
  durationDays?: number;
  currentDay?: number;
}

export interface PrescriptionAnalysis {
  medications: Medication[];
  notes: string;
}

export interface HealthStats {
  sleepHours: number;
  screenTime: number;
  waterIntake: number;
  mood: string;
  steps: number;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName?: string;
  patientAvatar?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Online' | 'In-person';
  status: 'Upcoming' | 'Completed' | 'Requested';
  notes?: string;
}