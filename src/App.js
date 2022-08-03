import logo from "./logo.svg";
import "./App.css";
import Login from "./Components/Login";
import { HashRouter, Route, Routes } from "react-router-dom";
import Uploadphotos from "./Components/Uploadphotos";
import ProjectDashboard from "./Components/projectDashboard";
import Dashboard from "./Components/Dashboard";
import EventDashboard from "./Components/EventDashboard";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload-photos" element={<Uploadphotos />} />
        <Route path="/allproject" element={<ProjectDashboard />} />
        <Route path="/projects" element={<EventDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
