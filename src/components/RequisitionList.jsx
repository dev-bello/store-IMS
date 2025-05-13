"use client";

import { useContext, useState } from "react";
import { RequisitionContext } from "../context/RequisitionContext";
import "./RequisitionList.css";

const RequisitionList = () => {
  const { requisitions, deleteRequisition, getItemById } =
    useContext(RequisitionContext);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get unique departments for filter
  const departments = [
    ...new Set(requisitions.map((req) => req.department)),
  ].sort();

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setConfirmDelete(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDelete) {
      deleteRequisition(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  // Filter and sort requisitions
  const filteredRequisitions = requisitions
    .filter((req) => {
      const item = getItemById(req.itemId);
      const itemName = item ? item.name.toLowerCase() : "";
      const department = req.department ? req.department.toLowerCase() : "";
      const searchLower = searchTerm.toLowerCase();

      return (
        (itemName.includes(searchLower) || department.includes(searchLower)) &&
        (filterDepartment === "" ||
          department === filterDepartment.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === "department") {
        return sortOrder === "asc"
          ? a.department.localeCompare(b.department)
          : b.department.localeCompare(a.department);
      } else if (sortBy === "item") {
        const itemA = getItemById(a.itemId);
        const itemB = getItemById(b.itemId);
        const nameA = itemA ? itemA.name : "";
        const nameB = itemB ? itemB.name : "";
        return sortOrder === "asc"
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      }
      return 0;
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="requisition-list-container">
      <h2>Requisition History</h2>

      <div className="requisition-filters">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search items or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="form-group">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="filter-select"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRequisitions.length > 0 ? (
        <div className="requisition-table-container">
          <table className="requisition-table">
            <thead>
              <tr>
                <th
                  onClick={() => handleSort("date")}
                  className="sortable-header"
                >
                  Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("item")}
                  className="sortable-header"
                >
                  Item {sortBy === "item" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Quantity</th>
                <th
                  onClick={() => handleSort("department")}
                  className="sortable-header"
                >
                  Department{" "}
                  {sortBy === "department" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>Requested By</th>
                <th>Approved By</th>
                <th>Remarks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequisitions.map((req) => {
                const item = getItemById(req.itemId);
                return (
                  <tr key={req.id}>
                    <td>{new Date(req.date).toLocaleDateString()}</td>
                    <td>{item ? item.name : "Unknown Item"}</td>
                    <td>
                      {req.quantity} {item ? item.unit : ""}
                    </td>
                    <td>{req.department}</td>
                    <td>{req.requestedBy}</td>
                    <td>{req.approvedBy}</td>
                    <td>{req.remarks}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteClick(req.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-requisitions">No requisitions found.</p>
      )}

      {confirmDelete && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this requisition? This will return
              the items to inventory.
            </p>
            <div className="delete-modal-actions">
              <button onClick={handleConfirmDelete} className="btn btn-danger">
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequisitionList;
