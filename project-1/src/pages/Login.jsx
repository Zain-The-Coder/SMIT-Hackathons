import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const role = docSnap.data().role.toLowerCase();
                if (role === "doctor") navigate("/doctor");
                else if (role === "receptionist") navigate("/receptionist");
                else if (role === "patient") navigate("/patient");
            }
        } catch (err) {
            alert("Invalid Credentials!");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-blue-100 border border-slate-100">
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl font-black text-slate-900 mb-2 italic">Welcome Back.</h1>
                        <p className="text-slate-400 font-medium">Log in to your clinic dashboard</p>
                    </div>

                    <form onSubmit={loginHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">Email</label>
                            <input className="w-full p-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" 
                                type="email" placeholder="doctor@clinic.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase ml-1">Password</label>
                            <input className="w-full p-4 bg-slate-50 border-none rounded-2xl ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none" 
                                type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>

                        <button disabled={loading} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]">
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-8 text-slate-500 font-medium">
                    Don't have an account? <Link to="/" className="text-slate-900 font-black hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;