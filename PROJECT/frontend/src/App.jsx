import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Inventory from "./components/Inventory"; // Imported Inventory component
import Menu from "./components/Menu"; // Imported Inventory component
import R_g from "./components/R_g"; // 
import Navbar from "./components/Navbar";
import "./global.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar added here */}
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/inventory" element={<Inventory />} /> {/* New Inventory Route */}
          <Route path="/menu" element={<Menu />} /> {/* New Inventory Route */}
          <Route path="/r_g" element={<R_g />} /> {/* New Inventory Route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
