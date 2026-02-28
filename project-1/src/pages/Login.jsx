import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch Role from Firestore
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const role = docSnap.data().role.toLowerCase();
                // Redirect based on role
                if (role === "doctor") navigate("/doctor");
                else if (role === "receptionist") navigate("/receptionist");
                else if (role === "patient") navigate("/patient");
                else setError("Role not recognized.");
            } else {
                setError("No user data found in Firestore.");
            }
        } catch (err) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Login</h2>
                <form onSubmit={loginHandler} className="space-y-4 text-left">
                    <input className="w-full px-4 py-3 bg-gray-50 border rounded-lg outline-none" 
                        type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input className="w-full px-4 py-3 bg-gray-50 border rounded-lg outline-none" 
                        type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                    
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>
                <p className="mt-4 text-sm text-gray-500">New user? <Link to="/register" className="text-blue-600">Register</Link></p>
            </div>
        </div>
    );
}
export default Login;