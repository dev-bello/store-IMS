"use client";

import { useContext, useState } from "react";
import { RequisitionContext } from "../context/RequisitionContext";
import ReportTemplate from "./ReportTemplate";
import "./Report.css";

const WeeklyReport = () => {
  const { getWeeklyRequisitions, processRequisitionsForReport } =
    useContext(RequisitionContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleGenerateReport = () => {
    // If no dates selected, use current week
    if (!startDate || !endDate) {
      const now = new Date();
      const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay()
      );
      const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (6 - now.getDay())
      );

      const weeklyRequisitions = getWeeklyRequisitions();

      setGeneratedReport({
        title: `OFFICE CONSUMABLES ISSUED FOR THE WEEK OF ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        date: new Date().toISOString(),
        requisitions: weeklyRequisitions,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
    } else {
      // Use selected date range
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Filter requisitions within the date range
      const requisitions = getWeeklyRequisitions().filter((req) => {
        const reqDate = new Date(req.date);
        return reqDate >= start && reqDate <= end;
      });

      setGeneratedReport({
        title: `OFFICE CONSUMABLES ISSUED FOR THE WEEK OF ${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
        date: new Date().toISOString(),
        requisitions,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
    }
  };

  return (
    <div className="report-container">
      <h2>Weekly Report</h2>

      <div className="report-controls">
        <div className="form-group">
          <label htmlFor="startDate">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleGenerateReport}>
          Generate Report
        </button>
      </div>

      {generatedReport && (
        <ReportTemplate
          title={generatedReport.title}
          date={generatedReport.date}
          items={processRequisitionsForReport(generatedReport.requisitions)}
          reportType="weekly"
        />
      )}
    </div>
  );
};

export default WeeklyReport;
