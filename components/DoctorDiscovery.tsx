
import React, { useState } from 'react';
import { MOCK_DOCTORS, SPECIALIZATIONS } from '../constants';
import { Doctor } from '../types';

const DoctorDiscovery: React.FC = () => {
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [bookingDoc, setBookingDoc] = useState<Doctor | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const filteredDoctors = selectedSpec === 'All' 
    ? MOCK_DOCTORS 
    : MOCK_DOCTORS.filter(d => d.specialization === selectedSpec);

  const handleBook = (doc: Doctor) => {
    setBookingDoc(doc);
  };

  const confirmBooking = () => {
    setBookingSuccess(true);
    setTimeout(() => {
        setBookingSuccess(false);
        setBookingDoc(null);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Nearby Professionals</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setSelectedSpec('All')}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedSpec === 'All' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            All
          </button>
          {SPECIALIZATIONS.map(spec => (
            <button 
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedSpec === spec ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex space-x-4 hover:shadow-md transition-shadow">
            <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{doctor.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                  <span className="text-yellow-600 text-xs font-bold mr-1">★</span>
                  <span className="text-xs font-bold text-yellow-700">{doctor.rating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-medium">📍 {doctor.clinic} • {doctor.distance}</p>
              <div className="mt-4 flex gap-2">
                <button 
                    onClick={() => handleBook(doctor)}
                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                    Book Appointment
                </button>
                {doctor.onlineConsultation && (
                    <button className="flex-1 bg-blue-50 text-blue-600 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                        Online Consult
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
            {!bookingSuccess ? (
                <>
                    <button onClick={() => setBookingDoc(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">❌</button>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Confirm Booking</h3>
                    <p className="text-sm text-slate-500 mb-6">Select a preferred time slot with {bookingDoc.name}.</p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-8">
                        {bookingDoc.availability.map(time => (
                            <button key={time} className="p-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-all">
                                {time}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={confirmBooking}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
                    >
                        Reserve Slot
                    </button>
                </>
            ) : (
                <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h3>
                    <p className="text-slate-500">You're all set. We've sent the details to your email and phone.</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDiscovery;
