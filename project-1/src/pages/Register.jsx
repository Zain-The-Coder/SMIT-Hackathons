import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Fix: Create use karein
import { auth, db } from '../firebase'; // Path check karlein sahi hai ya nahi
import { doc, setDoc } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [user, setUser] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state add ki

    const navigate = useNavigate();

    const registerHandler = async (e) => {
        e.preventDefault();
        setError("");
        setMsg("");
        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            await setDoc(doc(db, "users", newUser.uid), {
                name: user,
                email: email,
                role: role,
                uid: newUser.uid,
                createdAt: new Date().toISOString()
            });

            setMsg("Account Created Successfully! Redirecting...");
            
            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/login'); 
            }, 2000);

        } catch (err) {
            const errorMessage = err.message.includes("auth/") 
                ? err.message.split("/")[1].replace(")", "").replace(/-/g, " ") 
                : err.message;
            setError(errorMessage);
        } finally {
            setLoading(false); // Loading stop chahe success ho ya error
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Create Account</h2>

                <form onSubmit={registerHandler} className="space-y-4">
                    <div>
                        <label className="block pl-[4px] text-sm font-medium text-gray-700">Full Name</label>
                        <input className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            onChange={(e) => setUser(e.target.value)} value={user}
                            type="text" placeholder="Enter Your Name" required disabled={loading}/>
                    </div>

                    <div>
                        <label className="block pl-[4px] text-sm font-medium text-gray-700">Email Address</label>
                        <input className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            onChange={(e) => setEmail(e.target.value)} value={email}
                            type="email" placeholder="Enter Your Email" required disabled={loading}/>
                    </div>

                    <div>
                        <label className="block pl-[4px] text-sm font-medium text-gray-700">Password</label>
                        <input className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            onChange={(e) => setPassword(e.target.value)} value={password}
                            type="password" placeholder="••••••••" required disabled={loading}/>
                    </div>

                    <div>
                        <label className="block pl-[4px] text-sm font-medium text-gray-700">Role</label>
                        <select className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={role} onChange={(e) => setRole(e.target.value)} required disabled={loading}>
                            <option value="" disabled>Select Role</option>
                            <option value="doctor">Doctor</option>
                            <option value="receptionist">Receptionist</option>
                            <option value="patient">Patient</option>
                        </select>
                    </div>

                    {msg && <div className="p-3 rounded bg-green-100 text-green-700 text-sm font-medium">{msg}</div>}
                    {error && <div className="p-3 rounded bg-red-100 text-red-700 text-sm font-medium">{error}</div>}

                    <button 
                        type='submit' 
                        disabled={loading}
                        className={`w-full ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold py-3 rounded-lg shadow-md transition duration-200 transform active:scale-[0.98] flex justify-center items-center`}
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Processing...
                            </span>
                        ) : 'Register'}
                    </button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;