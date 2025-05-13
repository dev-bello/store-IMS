"use client";

import { createContext, useState, useEffect } from "react";

export const RequisitionContext = createContext();

export const RequisitionProvider = ({ children }) => {
  const [requisitions, setRequisitions] = useState(() => {
    const savedRequisitions = localStorage.getItem("requisitions");
    return savedRequisitions ? JSON.parse(savedRequisitions) : [];
  });

  const [inventory, setInventory] = useState(() => {
    const savedInventory = localStorage.getItem("inventory");
    return savedInventory
      ? JSON.parse(savedInventory)
      : [
          { id: 1, name: "A4 Paper", unit: "ream", quantity: 50 },
          { id: 2, name: "Shredder", unit: "pcs", quantity: 5 },
          { id: 3, name: "AAA Batteries", unit: "pcs", quantity: 120 },
          { id: 4, name: "AA Batteries", unit: "pkt", quantity: 30 },
          { id: 5, name: "File Jackets (Open)", unit: "pcs", quantity: 150 },
          { id: 6, name: "A3 Envelopes", unit: "pkt", quantity: 10 },
          { id: 7, name: "A4 Envelopes", unit: "pkt", quantity: 25 },
          { id: 8, name: "Extension Cable", unit: "pcs", quantity: 15 },
          { id: 9, name: "Bic Biro (Crystal) blue", unit: "pkt", quantity: 20 },
          {
            id: 10,
            name: "Bic Biro (Crystal) black",
            unit: "pkt",
            quantity: 20,
          },
          { id: 11, name: "Letter Head (General)", unit: "ream", quantity: 15 },
          { id: 12, name: "File Tags", unit: "pkt", quantity: 20 },
          { id: 13, name: "Binder Clip 32mm", unit: "pkt", quantity: 10 },
          { id: 14, name: "Conqueror Paper", unit: "ream", quantity: 10 },
          {
            id: 15,
            name: "Correction fluid/Tippex",
            unit: "pcs",
            quantity: 25,
          },
          { id: 16, name: "Double punch", unit: "pcs", quantity: 8 },
        ];
  });

  useEffect(() => {
    localStorage.setItem("requisitions", JSON.stringify(requisitions));
  }, [requisitions]);

  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  const addRequisition = (requisitionData) => {
    const { items, department, requestedBy, approvedBy, remarks } =
      requisitionData;

    // Create a new requisition with multiple items
    const newRequisition = {
      id: Date.now(),
      date: new Date().toISOString(),
      department,
      requestedBy,
      approvedBy,
      remarks,
      items: items.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        remarks: item.remarks || "",
      })),
    };

    setRequisitions([...requisitions, newRequisition]);

    // Update inventory for all items
    const updatedInventory = [...inventory];

    items.forEach((item) => {
      const inventoryItemIndex = updatedInventory.findIndex(
        (invItem) => invItem.id === item.itemId
      );
      if (inventoryItemIndex !== -1) {
        updatedInventory[inventoryItemIndex] = {
          ...updatedInventory[inventoryItemIndex],
          quantity:
            updatedInventory[inventoryItemIndex].quantity - item.quantity,
        };
      }
    });

    setInventory(updatedInventory);
  };

  const deleteRequisition = (id) => {
    // Find the requisition to be deleted
    const requisitionToDelete = requisitions.find((req) => req.id === id);

    if (requisitionToDelete) {
      // Return all items to inventory
      const updatedInventory = [...inventory];

      requisitionToDelete.items.forEach((item) => {
        const inventoryItemIndex = updatedInventory.findIndex(
          (invItem) => invItem.id === item.itemId
        );
        if (inventoryItemIndex !== -1) {
          updatedInventory[inventoryItemIndex] = {
            ...updatedInventory[inventoryItemIndex],
            quantity:
              updatedInventory[inventoryItemIndex].quantity + item.quantity,
          };
        }
      });

      // Remove the requisition
      const updatedRequisitions = requisitions.filter((req) => req.id !== id);

      setRequisitions(updatedRequisitions);
      setInventory(updatedInventory);
    }
  };

  const getWeeklyRequisitions = () => {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );

    return requisitions.filter((req) => {
      const reqDate = new Date(req.date);
      return reqDate >= oneWeekAgo && reqDate <= now;
    });
  };

  const getMonthlyRequisitions = (month, year) => {
    return requisitions.filter((req) => {
      const reqDate = new Date(req.date);
      return reqDate.getMonth() === month && reqDate.getFullYear() === year;
    });
  };

  const getItemById = (id) => {
    return inventory.find((item) => item.id === id);
  };

  // Process requisitions for reports - flattens the items for reporting
  const processRequisitionsForReport = (requisitionList) => {
    // Group by item and sum quantities
    const itemMap = {};

    requisitionList.forEach((req) => {
      req.items.forEach((item) => {
        const inventoryItem = getItemById(item.itemId);
        if (!inventoryItem) return;

        if (!itemMap[inventoryItem.id]) {
          itemMap[inventoryItem.id] = {
            id: inventoryItem.id,
            name: inventoryItem.name,
            quantity: 0,
            unit: inventoryItem.unit,
            remarks: [],
          };
        }

        itemMap[inventoryItem.id].quantity += item.quantity;
        if (item.remarks) {
          itemMap[inventoryItem.id].remarks.push(item.remarks);
        }
      });
    });

    // Convert to array and sort by ID
    return Object.values(itemMap).sort((a, b) => a.id - b.id);
  };

  return (
    <RequisitionContext.Provider
      value={{
        requisitions,
        inventory,
        addRequisition,
        deleteRequisition,
        getWeeklyRequisitions,
        getMonthlyRequisitions,
        getItemById,
        processRequisitionsForReport,
      }}
    >
      {children}
    </RequisitionContext.Provider>
  );
};
