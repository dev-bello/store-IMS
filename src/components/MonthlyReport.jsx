"use client";

import { useContext, useState } from "react";
import { RequisitionContext } from "../context/RequisitionContext";
import ReportTemplate from "./ReportTemplate";
import "./Report.css";

const MonthlyReport = () => {
  const { getMonthlyRequisitions, processRequisitionsForReport } =
    useContext(RequisitionContext);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [generatedReport, setGeneratedReport] = useState(null);

  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" },
  ];

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 5; i <= currentYear + 1; i++) {
    years.push(i);
  }

  const handleGenerateReport = () => {
    // If no month selected, use current month
    const selectedMonth =
      month === "" ? new Date().getMonth() : Number.parseInt(month, 10);
    const selectedYear = year || new Date().getFullYear();

    const monthlyRequisitions = getMonthlyRequisitions(
      selectedMonth,
      selectedYear
    );

    setGeneratedReport({
      title: `OFFICE CONSUMABLES ISSUED AT THE MONTH OF ${months
        .find((m) => m.value === selectedMonth)
        .label.toUpperCase()} ${selectedYear}`,
      date: new Date().toISOString(),
      requisitions: monthlyRequisitions,
      month: selectedMonth,
      year: selectedYear,
    });
  };

  return (
    <div className="report-container">
      <h2>Monthly Report</h2>

      <div className="report-controls">
        <div className="form-group">
          <label htmlFor="month">Month</label>
          <select
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="">Current Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(Number.parseInt(e.target.value, 10))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
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
          reportType="monthly"
          month={months.find((m) => m.value === generatedReport.month).label}
          year={generatedReport.year}
        />
      )}
    </div>
  );
};

export default MonthlyReport;
