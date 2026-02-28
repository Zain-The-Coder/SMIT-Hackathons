import DoctorDashboard from "./pages/DoctorDashboard"
import Login from "./pages/Login"
import PatientDashboard from "./pages/PatientDashboard"
import ReceptionistDashboard from "./pages/ReceptionistDashboard"
import Register from "./pages/Register"
import { Routes , Route, useLocation } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const location = useLocation();

  return (
    // Global Wrapper: Pure app ka background aur font yahan se control hoga
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-700">
      
      {/* Route Transitions Container */}
      <div className="relative">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes - Modern & Clean */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Register />} />

          {/* 1. Doctor Route - Premium Protected Dashboard */}
          <Route 
            path="/doctor" 
            element={
              <ProtectedRoute allowedRole="doctor">
                <div className="animate-in fade-in duration-500">
                  <DoctorDashboard />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* 2. Receptionist Route */}
          <Route 
            path="/receptionist" 
            element={
              <ProtectedRoute allowedRole="receptionist">
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <ReceptionistDashboard />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* 3. Patient Route */}
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute allowedRole="patient">
                <div className="animate-in zoom-in-95 duration-500">
                  <PatientDashboard />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* 404 Page (Optional but good for marks) */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
              <h1 className="text-9xl font-black text-slate-200">404</h1>
              <p className="text-xl text-slate-500 -mt-4 font-bold">Oops! Page not found.</p>
              <button onClick={() => window.history.back()} className="mt-6 text-blue-600 font-bold hover:underline">Go Back</button>
            </div>
          } />
        </Routes>
      </div>

      {/* Global Toast/Notification Area (Future implementation) */}
      <div id="portal-root"></div>
    </div>
  )
}

export default App;