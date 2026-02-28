
import DoctorDashboard from "./pages/DoctorDashboard"
import Login from "./pages/Login"
import PatientDashboard from "./pages/PatientDashboard"
import ReceptionistDashboard from "./pages/ReceptionistDashboard"
import Register from "./pages/Register"
import { Routes , Route } from "react-router-dom"

function App() {
  return (
    <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Register />} />
  
    <Route path="/doctor" element={<DoctorDashboard />} />
    <Route path="/receptionist" element={<ReceptionistDashboard />} />
    <Route path="/patient" element={<PatientDashboard />} />
    </Routes>
    </>
  )
}

export default App
