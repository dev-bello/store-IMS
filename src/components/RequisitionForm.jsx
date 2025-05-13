"use client";

import { useState, useContext } from "react";
import { RequisitionContext } from "../context/RequisitionContext";
import "./RequisitionForm.css";

const RequisitionForm = () => {
  const { inventory, addRequisition } = useContext(RequisitionContext);
  const [formData, setFormData] = useState({
    department: "",
    requestedBy: "",
    approvedBy: "",
    remarks: "",
  });

  const [items, setItems] = useState([
    { id: Date.now(), itemId: "", quantity: "", remarks: "" },
  ]);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...items];

    if (name === "itemId" || name === "quantity") {
      updatedItems[index][name] = Number.parseInt(value, 10) || "";
    } else {
      updatedItems[index][name] = value;
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), itemId: "", quantity: "", remarks: "" },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate department and other fields
    if (!formData.department.trim()) {
      newErrors.department = "Department is required";
    }

    if (!formData.requestedBy.trim()) {
      newErrors.requestedBy = "Requested By is required";
    }

    if (!formData.approvedBy.trim()) {
      newErrors.approvedBy = "Approved By is required";
    }

    // Validate items
    const itemErrors = [];
    let hasItemErrors = false;

    items.forEach((item, index) => {
      const itemError = {};

      if (!item.itemId) {
        itemError.itemId = "Item is required";
        hasItemErrors = true;
      }

      if (!item.quantity) {
        itemError.quantity = "Quantity is required";
        hasItemErrors = true;
      } else {
        const inventoryItem = inventory.find(
          (invItem) => invItem.id === item.itemId
        );
        if (inventoryItem && item.quantity > inventoryItem.quantity) {
          itemError.quantity = `Maximum available: ${inventoryItem.quantity}`;
          hasItemErrors = true;
        }
      }

      itemErrors[index] = itemError;
    });

    if (hasItemErrors) {
      newErrors.items = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Format items for submission
    const formattedItems = items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      remarks: item.remarks,
    }));

    // Submit requisition
    addRequisition({
      ...formData,
      items: formattedItems,
    });

    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        department: "",
        requestedBy: "",
        approvedBy: "",
        remarks: "",
      });
      setItems([{ id: Date.now(), itemId: "", quantity: "", remarks: "" }]);
      setSubmitted(false);
      setErrors({});
    }, 3000);
  };

  return (
    <div className="requisition-form-container">
      <h2>New Requisition</h2>

      {submitted ? (
        <div className="success-message">
          <p>Requisition submitted successfully!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="requisition-form">
          <div className="form-section">
            <h3>Department Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? "input-error" : ""}
                />
                {errors.department && (
                  <div className="error-message">{errors.department}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="requestedBy">Requested By</label>
                <input
                  type="text"
                  id="requestedBy"
                  name="requestedBy"
                  value={formData.requestedBy}
                  onChange={handleChange}
                  className={errors.requestedBy ? "input-error" : ""}
                />
                {errors.requestedBy && (
                  <div className="error-message">{errors.requestedBy}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="approvedBy">Approved By</label>
                <input
                  type="text"
                  id="approvedBy"
                  name="approvedBy"
                  value={formData.approvedBy}
                  onChange={handleChange}
                  className={errors.approvedBy ? "input-error" : ""}
                />
                {errors.approvedBy && (
                  <div className="error-message">{errors.approvedBy}</div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Items</h3>
            {items.map((item, index) => {
              const itemErrors =
                errors.items && errors.items[index] ? errors.items[index] : {};
              const selectedItem = item.itemId
                ? inventory.find((invItem) => invItem.id === item.itemId)
                : null;

              return (
                <div key={item.id} className="item-row">
                  <div className="form-row">
                    <div className="form-group item-select">
                      <label htmlFor={`item-${index}`}>Item</label>
                      <select
                        id={`item-${index}`}
                        name="itemId"
                        value={item.itemId}
                        onChange={(e) => handleItemChange(index, e)}
                        className={itemErrors.itemId ? "input-error" : ""}
                      >
                        <option value="">Select an item</option>
                        {inventory.map((invItem) => (
                          <option key={invItem.id} value={invItem.id}>
                            {invItem.name} ({invItem.quantity} {invItem.unit}{" "}
                            available)
                          </option>
                        ))}
                      </select>
                      {itemErrors.itemId && (
                        <div className="error-message">{itemErrors.itemId}</div>
                      )}
                    </div>

                    <div className="form-group item-quantity">
                      <label htmlFor={`quantity-${index}`}>Quantity</label>
                      <input
                        type="number"
                        id={`quantity-${index}`}
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        min="1"
                        max={selectedItem ? selectedItem.quantity : 1}
                        className={itemErrors.quantity ? "input-error" : ""}
                      />
                      {selectedItem && <small>Unit: {selectedItem.unit}</small>}
                      {itemErrors.quantity && (
                        <div className="error-message">
                          {itemErrors.quantity}
                        </div>
                      )}
                    </div>

                    <div className="form-group item-remarks">
                      <label htmlFor={`remarks-${index}`}>Item Remarks</label>
                      <input
                        type="text"
                        id={`remarks-${index}`}
                        name="remarks"
                        value={item.remarks}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Optional"
                      />
                    </div>

                    <div className="item-actions">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn-remove-item"
                        disabled={items.length === 1}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={addItem}
              className="btn   add-item-btn"
            >
              + Add Another Item
            </button>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="remarks">General Remarks</label>
              <textarea
                id="remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Optional"
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn btn-primary submit-btn">
            Submit Requisition
          </button>
        </form>
      )}
    </div>
  );
};

export default RequisitionForm;
