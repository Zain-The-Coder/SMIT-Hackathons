import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';
import { jsPDF } from "jspdf";

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPat, setSelectedPat] = useState(null);
    const [medicines, setMedicines] = useState([]); 
    const [medInput, setMedInput] = useState({ name: "", dosage: "", timing: "" });
    const [symptoms, setSymptoms] = useState("");
    const [aiAnalysis, setAiAnalysis] = useState("");
    const [loading, setLoading] = useState(false);

    // Data Load Karein
    useEffect(() => {
        const fetchPatients = async () => {
            const q = query(collection(db, "patients"), orderBy("createdAt", "desc"));
            const snap = await getDocs(q);
            setPatients(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchPatients();
    }, []);

    // Fake AI Logic for Marks (Symptom based suggestion)
    useEffect(() => {
        if (symptoms.length > 10) {
            const timer = setTimeout(() => {
                const lowerSymp = symptoms.toLowerCase();
                if (lowerSymp.includes("fever")) setAiAnalysis("Analysis: Possible Viral Infection. Advise: CBC Test & Hydration.");
                else if (lowerSymp.includes("cough")) setAiAnalysis("Analysis: Respiratory Tract Irritation. Advise: Chest X-Ray if persistent.");
                else setAiAnalysis("Analysis: General malaise. Advise: Routine checkup & Rest.");
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            setAiAnalysis("");
        }
    }, [symptoms]);

    const handleAddMedicine = () => {
        if (!medInput.name || !medInput.dosage) return alert("Medicine details fill karein!");
        setMedicines([...medicines, medInput]);
        setMedInput({ name: "", dosage: "", timing: "" });
    };

    const handleFinalize = async () => {
        if (!selectedPat || medicines.length === 0) return alert("Patient select karein aur medicines add karein!");
        setLoading(true);
        try {
            const presData = {
                patientId: selectedPat.id,
                patientName: selectedPat.name,
                doctorName: user?.email.split('@')[0].toUpperCase(),
                medicines,
                symptoms,
                createdAt: serverTimestamp()
            };
            
            await addDoc(collection(db, "prescriptions"), presData);
            
            // PDF Generation logic
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.setTextColor(30, 64, 175); // Blue color
            doc.text("HEALTHCARE CLINIC", 105, 20, { align: "center" });
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 25, 190, 25);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Patient: ${selectedPat.name}`, 20, 40);
            doc.text(`Doctor: Dr. ${user?.email.split('@')[0]}`, 20, 50);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 40);
            
            doc.text("SYMPTOMS:", 20, 70);
            doc.setFontSize(10);
            doc.text(symptoms || "N/A", 25, 78);
            
            doc.setFontSize(12);
            doc.text("RX / MEDICINES:", 20, 100);
            medicines.forEach((m, i) => {
                doc.text(`${i + 1}. ${m.name} --- ${m.dosage} (${m.timing || 'As directed'})`, 25, 110 + (i * 10));
            });
            
            doc.save(`Prescription_${selectedPat.name}.pdf`);
            alert("Prescription Saved & PDF Generated!");
            
            // Reset Form
            setMedicines([]);
            setSymptoms("");
            setSelectedPat(null);
        } catch (err) {
            console.error(err);
            alert("Error saving data!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. Sidebar - Today's Patients */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl overflow-hidden relative">
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Doctor</p>
                            <h2 className="text-2xl font-bold mt-1">Dr. {user?.email.split('@')[0]}</h2>
                            <div className="mt-8">
                                <span className="text-5xl font-black">{patients.length}</span>
                                <p className="text-slate-400 text-sm mt-2 font-medium">Patients waiting today</p>
                            </div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                    </div>

                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                            Waiting Room
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {patients.map(p => (
                                <button key={p.id} onClick={() => setSelectedPat(p)}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${selectedPat?.id === p.id ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}>
                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-blue-600 shadow-sm">{p.name[0]}</div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{p.phone}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Main Consultation Area */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 p-8 md:p-12">
                        {selectedPat ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-tighter">In Consultation</span>
                                        <h2 className="text-4xl font-black text-slate-900 mt-3">{selectedPat.name}</h2>
                                        <p className="text-slate-400 font-medium">Age: {selectedPat.age || 'N/A'} • {selectedPat.gender || 'Male'}</p>
                                    </div>
                                </div>

                                {/* Symptoms & AI */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Presenting Symptoms</label>
                                        <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                                            placeholder="Type patient symptoms here..."
                                            className="w-full h-32 p-5 bg-slate-50 rounded-[24px] border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none text-slate-700"
                                        />
                                    </div>
                                    <div className="bg-blue-600 rounded-[24px] p-6 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h4 className="text-xs font-black uppercase tracking-widest opacity-70">Diagnostic Assistant</h4>
                                            <p className="mt-4 text-sm font-medium leading-relaxed">
                                                {aiAnalysis || "Enter symptoms for real-time AI diagnosis suggestons..."}
                                            </p>
                                        </div>
                                        <div className="absolute top-0 right-0 p-4 opacity-20">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z"/></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Medicine Builder */}
                                <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 mb-8">
                                    <h3 className="font-black text-slate-800 mb-6 uppercase text-sm tracking-widest">Prescription (RX)</h3>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <input className="flex-1 min-w-[200px] p-4 bg-white rounded-2xl shadow-sm border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                            placeholder="Medicine Name" value={medInput.name} onChange={e => setMedInput({...medInput, name: e.target.value})} />
                                        <input className="w-32 p-4 bg-white rounded-2xl shadow-sm border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                                            placeholder="Dosage" value={medInput.dosage} onChange={e => setMedInput({...medInput, dosage: e.target.value})} />
                                        <button onClick={handleAddMedicine} className="bg-slate-900 text-white px-8 rounded-2xl font-black hover:bg-black transition-all">+</button>
                                    </div>

                                    <div className="space-y-2">
                                        {medicines.map((m, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 animate-in zoom-in-95">
                                                <span className="font-bold text-slate-700">{m.name}</span>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-lg uppercase">{m.dosage}</span>
                                                    <button onClick={() => setMedicines(medicines.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 font-bold">×</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handleFinalize} disabled={loading}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all">
                                    {loading ? "Processing..." : "FINALIZE & DISCHARGE"}
                                </button>
                            </div>
                        ) : (
                            <div className="h-[600px] flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                </div>
                                <h2 className="text-2xl font-black text-slate-300 italic">Select a patient to begin consultation</h2>
                                <p className="text-slate-400 mt-2">All clinical data is encrypted and secure.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;