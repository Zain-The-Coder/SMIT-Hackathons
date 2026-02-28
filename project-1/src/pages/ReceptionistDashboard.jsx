import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from 'firebase/firestore'; 
import { useAuth } from '../context/AuthContext';

const ReceptionistDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("register"); // "register" or "appointment"
    
    // States for Patient Registration
    const [newPatient, setNewPatient] = useState({ name: "", phone: "", age: "", gender: "Male" });
    
    // States for Appointment Booking
    const [doctors, setDoctors] = useState([]);      
    const [patients, setPatients] = useState([]);    
    const [selPatient, setSelPatient] = useState(""); 
    const [selDoctor, setSelDoctor] = useState("");  
    const [appDate, setAppDate] = useState("");      
    
    const [loading, setLoading] = useState(false);

    // Data Load Function
    const loadAllData = async () => {
        try {
            const patSnap = await getDocs(query(collection(db, "patients"), orderBy("createdAt", "desc")));
            setPatients(patSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const userSnap = await getDocs(collection(db, "users"));
            setDoctors(userSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(u => u.role?.toLowerCase() === "doctor"));
        } catch (err) { console.error(err); }
    };

    useEffect(() => { loadAllData(); }, []);

    // 1. Patient Register Handler
    const handleRegister = async (e) => {
        e.preventDefault();
        if (!newPatient.name || !newPatient.phone) return alert("Zaroori maloomat bharein!");
        setLoading(true);
        try {
            await addDoc(collection(db, "patients"), { ...newPatient, createdAt: serverTimestamp() });
            alert("✅ Patient Registered Successfully!");
            setNewPatient({ name: "", phone: "", age: "", gender: "Male" });
            loadAllData();
        } catch (err) { alert("Error: " + err.message); }
        setLoading(false);
    };

    // 2. Appointment Book Handler
    const handleBook = async (e) => {
        e.preventDefault();
        if(!selPatient || !selDoctor || !appDate) return alert("Tamam fields select karein!");
        
        const p = patients.find(x => x.id === selPatient);
        const d = doctors.find(x => x.id === selDoctor);
        
        try {
            await addDoc(collection(db, "appointments"), {
                patientId: p.id, patientName: p.name, 
                doctorId: d.id, doctorName: d.name,
                date: appDate, status: "pending", createdAt: serverTimestamp()
            });
            alert("📅 Appointment Booked!");
            setAppDate("");
        } catch (err) { alert(err.message); }
    };

    return (
        <div className="min-h-screen bg-[#F4F7FE] p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header Card */}
                <div className="bg-white rounded-[32px] p-8 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reception Desk</h1>
                        <p className="text-slate-500 font-medium">Logged in as: {user?.email}</p>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button onClick={() => setActiveTab("register")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "register" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>New Patient</button>
                        <button onClick={() => setActiveTab("appointment")} className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "appointment" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Book Appointment</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100 h-full">
                            {activeTab === "register" ? (
                                <form onSubmit={handleRegister} className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">👤</div>
                                        Patient Registration
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Full Name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required />
                                        <input className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Phone Number" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} required />
                                        <input className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Age" type="number" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
                                        <select className="p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                                            <option>Male</option><option>Female</option><option>Other</option>
                                        </select>
                                    </div>
                                    <button className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">
                                        {loading ? "Registering..." : "Add to Database"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleBook} className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">📅</div>
                                        Create Appointment
                                    </h2>
                                    <select className="w-full p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none" onChange={e => setSelPatient(e.target.value)}>
                                        <option value="">Select Patient</option>
                                        {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>)}
                                    </select>
                                    <select className="w-full p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none" onChange={e => setSelDoctor(e.target.value)}>
                                        <option value="">Assign Doctor</option>
                                        {doctors.map(d => <option key={d.id} value={d.id}>Dr. {d.name || d.email.split('@')[0]}</option>)}
                                    </select>
                                    <input type="date" className="w-full p-4 bg-slate-50 rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none" value={appDate} onChange={e => setAppDate(e.target.value)} />
                                    <button className="w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">
                                        Confirm Booking
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Quick Records List */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 p-8 h-full">
                            <h3 className="font-bold text-slate-800 mb-6">Recent Records</h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                {patients.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-white hover:ring-2 hover:ring-slate-100 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">{p.name[0]}</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{p.phone}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setSelPatient(p.id); setActiveTab("appointment"); }} className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">Book Now</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionistDashboard;