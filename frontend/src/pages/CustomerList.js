import React, { useEffect, useState } from "react";
import {
  deleteCustomer,
  getCustomers,
} from "../services/customerServices";
import "./CustomerList.css";
import { useNavigate } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdMoreHoriz } from "react-icons/md";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [editCustomerID, setEditCustomerID] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await getCustomers();
      setCustomers(response.customers);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const exportToExcel = () => {
    const headers = ["name", "nic", "dateOfBirth", "mobileNumbers", "Addresses"];
    const rows = customers.map((c) => [c.name, c.nic, c.dateOfBirth, c.mobileNumbers, c.addresses, c.familyMemberIds]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (id) => navigate(`/customer/${id}`);

  const handleAddClick = () => {
    navigate("/addCustomer");
  };

  const handleEditClick = (id) => {
    if (!id) return;
    setEditCustomerID(id);
    navigate(`/editCustomer/${id}`);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await deleteCustomer(id);
        fetchCustomers();
      } catch (error) {
        alert("Failed to delete customer.");
        console.error(error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="customers-container">
      <h2>Customers</h2>
      <>
        <div className="actions">
          <button className="add-btn" onClick={handleAddClick}>
            Add Customer
          </button>
          <div className="add-btn" onClick={() => navigate("/bulk-upload")}>
            Add Customers (exel)
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>NIC</th>
              <th>DOB</th>
              <th>Mobiles</th>
              <th>Addresses</th>
              <th>Family Members</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((c, i) => (
              <tr key={i}>
                <td>{c?.name}</td>
                <td>{c?.nic}</td>
                <td>{c?.dateOfBirth}</td>
                <td>{c?.mobileNumbers?.join(", ")}</td>
                <td>
                  {(c?.addresses || []).map((address, idx) => (
                    <div key={idx}>
                      {address?.addressLine1}, {address?.addressLine2},{" "}
                      {address?.city}, {address?.country}
                    </div>
                  ))}
                </td>
                <td>
                  {(c?.familyMember || []).map((family, idx) => (
                    <div key={idx}>{family}</div>
                  ))}
                </td>
                <td>
                  <MdMoreHoriz
                    className="more-icon icon-btn2 "
                    title="View More"
                    onClick={() => handleView(c?.id)}
                  />
                  <FaEdit
                    className="edit-icon icon-btn2"
                    title="Edit"
                    onClick={() => handleEditClick(c?.id)}
                  />
                  <FaTrashAlt
                    className="delete-icon icon-btn2"
                    title="Delete"
                    onClick={() => handleDeleteClick(c?.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
      <div className="actions">
        <button className="add-btn" onClick={exportToExcel}>
          <FaDownload className="icon-btn2" />
          Export to Excel
        </button>
      </div>
    </div>
  );
}
