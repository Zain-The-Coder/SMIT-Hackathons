import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { auth, db } from '../firebase'; 
import { doc, setDoc } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const registerHandler = async (e) => {
        e.preventDefault();
        if(!role) return alert("Please select a role!");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            await setDoc(doc(db, "users", newUser.uid), {
                name,
                email,
                role: role.toLowerCase(),
                uid: newUser.uid,
                createdAt: new Date().toISOString()
            });

            alert("✨ Account Created! Please Login.");
            navigate('/login');
        } catch (err) {
            alert(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-100 border border-slate-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-black">H</div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Join Our Clinic</h1>
                    <p className="text-slate-400 mt-2 font-medium">Create your professional account</p>
                </div>

                <form onSubmit={registerHandler} className="space-y-5">
                    <input className="w-full p-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                        placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                    
                    <input className="w-full p-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                        type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
                    
                    <input className="w-full p-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none" 
                        type="password" placeholder="Password (6+ characters)" value={password} onChange={e => setPassword(e.target.value)} required />

                    <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
                        {['Doctor', 'Receptionist', 'Patient'].map((r) => (
                            <button key={r} type="button" onClick={() => setRole(r)}
                                className={`py-2 text-xs font-bold rounded-xl transition-all ${role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">
                        {loading ? "Creating..." : "Register Now"}
                    </button>
                </form>

                <p className="text-center mt-8 text-slate-500 font-medium text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;