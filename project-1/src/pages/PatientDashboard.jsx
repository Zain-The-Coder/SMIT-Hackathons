import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from "jspdf";

const PatientDashboard = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(() => {
        const fetchPres = async () => {
            const snap = await getDocs(collection(db, "prescriptions"));
            const all = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPrescriptions(all.filter(p => p.patientId === user.uid));
        };
        fetchPres();
    }, [user]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-12 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em]">Patient Hub</span>
                    <h1 className="text-5xl font-black text-slate-900 mt-2">Medical Timeline</h1>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    {prescriptions.map((p, i) => (
                        <div key={p.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Dot indicator */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 group-[.is-active]:bg-blue-600 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <svg className="fill-current" viewBox="0 0 12 12" width="12" height="12">
                                    <path d="M10.28 2.28L3.989 8.575 1.695 6.28A1 1 0 00.28 7.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 2.28z" />
                                </svg>
                            </div>
                            {/* Content Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[45%] bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-50/50 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <time className="text-xs font-bold text-blue-600 uppercase tracking-widest">{p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000).toLocaleDateString() : 'New Record'}</time>
                                </div>
                                <div className="text-slate-900 font-black text-xl mb-4">Dr. {p.doctorName}</div>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {p.medicines?.map((m, idx) => (
                                        <span key={idx} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-xs font-bold">
                                            {m.name}
                                        </span>
                                    ))}
                                </div>
                                <button className="w-full py-3 border-2 border-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                                    View Prescription
                                </button>
                            </div>
                        </div>
                    ))}

                    {prescriptions.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏥</div>
                            <p className="text-slate-400 font-bold">No medical history found yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;