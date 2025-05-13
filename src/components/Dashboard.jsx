"use client";

import { useContext } from "react";
import { Link } from "react-router-dom";
import { RequisitionContext } from "../context/RequisitionContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { requisitions, inventory, getItemById } =
    useContext(RequisitionContext);

  // Get recent requisitions (last 5)
  const recentRequisitions = [...requisitions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // Get low stock items (less than 10 units)

  // Count total items issued
  const totalItemsIssued = requisitions.reduce((total, req) => {
    return (
      total +
      req.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0)
    );
  }, 0);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Requisitions</h3>
          <p className="stat-value">{requisitions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Inventory Items</h3>
          <p className="stat-value">{inventory.length}</p>
        </div>
        <div className="stat-card">
          <h3>Items Issued</h3>
          <p className="stat-value">{totalItemsIssued}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <h3>Recent Requisitions</h3>
          {recentRequisitions.length > 0 ? (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Items</th>
                  <th>Requested By</th>
                </tr>
              </thead>
              <tbody>
                {recentRequisitions.map((req) => {
                  // Count total items
                  const totalItems = req.items.length;

                  // Get first item name
                  const firstItem = req.items[0];
                  const inventoryItem = firstItem
                    ? getItemById(firstItem.itemId)
                    : null;
                  const firstItemName = inventoryItem
                    ? inventoryItem.name
                    : "Unknown";

                  return (
                    <tr key={req.id}>
                      <td>{new Date(req.date).toLocaleDateString()}</td>
                      <td>{req.department}</td>
                      <td>
                        {totalItems > 1
                          ? `${firstItemName} +${totalItems - 1} more`
                          : firstItemName}
                      </td>
                      <td>{req.requestedBy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No recent requisitions</p>
          )}
          <div className="dashboard-links">
            <Link to="/requisition" className="dashboard-link">
              New Requisition
            </Link>
            <Link to="/requisitions" className="dashboard-link">
              View All Requisitions
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/weekly-report" className="btn btn-primary">
          Generate Weekly Report
        </Link>
        <Link to="/monthly-report" className="btn btn-primary">
          Generate Monthly Report
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
