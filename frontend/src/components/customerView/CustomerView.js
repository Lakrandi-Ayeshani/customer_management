import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomer } from "../../services/customerServices";
import "./CustomerView.css";

export default function CustomerView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [expandedMembers, setExpandedMembers] = useState({});

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getCustomer(id);
        setCustomer(response);
      } catch (error) {
        console.error("Error loading customer:", error);
      }
    };
    fetchCustomer();
  }, [id]);

  const toggleMember = (index) => {
    setExpandedMembers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="customer-container">
      <div className="customer-card">
        <h2 className="customer-title">Customer Details</h2>

        <p><strong>Name:</strong> {customer?.name}</p>
        <p><strong>DOB:</strong> {customer?.dateOfBirth}</p>
        <p><strong>NIC:</strong> {customer?.nic}</p>

        <div className="customer-section">
          <strong>Mobile Numbers:</strong>
          <ul className="customer-list">
            {customer?.mobileNumbers?.map((mobile, i) => (
              <li key={i}>{mobile}</li>
            ))}
          </ul>
        </div>

        <div className="customer-section">
          <strong>Addresses:</strong>
          {customer?.addresses?.map((addr, i) => (
            <div key={i} className="address-card">
                {addr?.addressLine1}, {addr?.addressLine2}, {addr?.city}, {addr?.country}
            </div>
          ))}
        </div>

        {customer.familyMembers?.length > 0 && (
          <div className="customer-section">
            <strong>Family Members:</strong>
            <ul className="family-list">
              {customer?.familyMembers?.map((member, i) => (
                <li key={i}>
                  <button className="member-toggle" onClick={() => toggleMember(i)}>
                    {member?.name}
                  </button>
                  {expandedMembers[i] && (
                    <div className="member-details">
                      <p><strong>Name:</strong> {member?.name}</p>
                      <p><strong>DOB:</strong> {member?.dateOfBirth}</p>
                      <p><strong>NIC:</strong> {member?.nic}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="back-button" onClick={() => navigate("/")}>Back</button>
      </div>
    </div>
  );
}
