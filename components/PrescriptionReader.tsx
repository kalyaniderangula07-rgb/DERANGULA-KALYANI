
import React, { useState, useRef } from 'react';
import { analyzePrescription } from '../services/geminiService';
import { Medication, PrescriptionAnalysis } from '../types';

interface PrescriptionReaderProps {
  onConfirmed: (medications: Medication[]) => void;
}

const PrescriptionReader: React.FC<PrescriptionReaderProps> = ({ onConfirmed }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<PrescriptionAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        setImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const result = await analyzePrescription(image);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please ensure the text is clear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {!analysis ? (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Prescription Reader</h2>
          <p className="text-slate-500 mb-6 text-sm italic">Scan your prescription to automatically set up medicine reminders.</p>

          <div className="space-y-6">
            {!image ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <span className="text-5xl mb-2 group-hover:scale-110 transition-transform">📄</span>
                <span className="text-sm font-bold text-slate-600">Upload Prescription Photo</span>
                <span className="text-xs text-slate-400 mt-1">Clear photo of meds and schedule</span>
              </button>
            ) : (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200 bg-slate-100">
                <img src={`data:image/jpeg;base64,${image}`} alt="Prescription" className="w-full h-full object-contain" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-white"
                >
                  ❌
                </button>
              </div>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />

            <button
              onClick={handleScan}
              disabled={!image || loading}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Digitizing Prescription...
                </>
              ) : 'Start Analysis'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Scan Results</h2>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {analysis.medications.length} Medications Detected
            </span>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6 flex items-start space-x-3">
              <span className="text-xl">⚠️</span>
              <p className="text-[10px] text-blue-700 leading-relaxed font-bold uppercase tracking-tight">
                  Verify the AI extraction against your physical prescription before setting reminders. Our AI is an assistant, not a medical professional.
              </p>
          </div>

          <div className="space-y-4 mb-8">
            {analysis.medications.map((med, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-slate-800">{med.name}</h4>
                    <p className="text-xs text-slate-500">{med.dosage} • {med.schedule}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{med.time}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">TIME</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => onConfirmed(analysis.medications)}
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Set All Reminders
            </button>
            <button 
              onClick={() => setAnalysis(null)}
              className="flex-1 border border-slate-200 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all"
            >
              Rescan Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionReader;
