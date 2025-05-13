import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import RequisitionForm from "./components/RequisitionForm";
import RequisitionList from "./components/RequisitionList";
import WeeklyReport from "./components/WeeklyReport";
import MonthlyReport from "./components/MonthlyReport";
import Navbar from "./components/Navbar";
import { RequisitionProvider } from "./context/RequisitionContext";
import "./App.css";

function App() {
  return (
    <RequisitionProvider>
      <Router>
        <div className="app">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/requisition" element={<RequisitionForm />} />
              <Route path="/requisitions" element={<RequisitionList />} />
              <Route path="/weekly-report" element={<WeeklyReport />} />
              <Route path="/monthly-report" element={<MonthlyReport />} />
            </Routes>
          </div>
        </div>
      </Router>
    </RequisitionProvider>
  );
}

export default App;
