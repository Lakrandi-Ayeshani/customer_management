import React, { useEffect, useState } from "react";
import "./CustomerForm.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCustomer,
  updateCustomer,
  getCustomer,
  getLocations,
  getCustomers,
} from "../services/customerServices";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { validateCustomerForm } from "../utils/validation";

const initialCustomerData = {
  name: "",
  dateOfBirth: "",
  nic: "",
  mobileNumbers: [""],
  addresses: [{ addressLine1: "", addressLine2: "", city: "", country: "" }],
  familyMembers: [""],
  familyMemberIds: [],
};

export default function CustomerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialCustomerData);
  const { id } = useParams();
  const [locations, setLocations] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (id) {
        try {
          const response = await getCustomer(id);
          console.log(response);
          setFormData(response);
        } catch (err) {
          console.error("Error fetching customer:", err);
        }
      }
    };
    fetchCustomer();
  }, [id]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await getLocations(id);
        setLocations(response);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers(id);
        setFamilyMembers(response.customers);
      } catch (err) {
        console.error("Error fetching customer:", err);
      }
    };
    fetchCustomers();
  }, []);

  // const selectedOptions = Array.from(e.target.selectedOptions).map(
  //   (option) => Number(option.value) // convert to number
  // );

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMobileChange = (index, value) => {
    const updated = [...formData.mobileNumbers];
    updated[index] = value;
    setFormData({ ...formData, mobileNumbers: updated });
  };

  const addMobile = () => {
    setFormData({
      ...formData,
      mobileNumbers: [...formData.mobileNumbers, ""],
    });
  };

  const removeMobile = (index) => {
    const updated = formData.mobileNumbers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      mobileNumbers: updated.length ? updated : [""],
    });
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...formData.addresses];
    updated[index][field] = value;
    setFormData({ ...formData, addresses: updated });
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      addresses: [
        ...formData.addresses,
        { addressLine1: "", addressLine2: "", city: "", country: "" },
      ],
    });
  };

  const removeAddress = (index) => {
    const updated = formData.addresses.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      addresses: updated.length
        ? updated
        : [{ addressLine1: "", addressLine2: "", city: "", country: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCustomerForm(formData);
    if (Object.keys(errors).length > 0) {
      alert(Object.values(errors).join("\n"));
      return;
    }
    const familyMemberIds = formData?.familyMembers?.map((f) => f.id) || [];
    formData.familyMemberIds = [...familyMemberIds];

    try {
      if (id) {
        await updateCustomer(id, formData);
      } else {
        await createCustomer(formData);
      }
      navigate("/");
    } catch (error) {
      alert("Failed to save customer.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="customer-form-wrapper">
      <form className="customer-form" onSubmit={handleSubmit}>
        <h3>{id ? "Edit Customer" : "Add Customer"}</h3>

        <label>
          Name*:
          <input
            name="name"
            type="text"
            value={formData?.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date of Birth*:
          <input
            type="date"
            name="dateOfBirth"
            value={formData?.dateOfBirth}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          NIC*:
          <input
            name="nic"
            type="text"
            value={formData?.nic}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mobile Number
          <IoMdAdd
            onClick={addMobile}
            className="icon-btn"
            title="Add mobile number"
          />
          {formData?.mobileNumbers?.map((mobile, i) => (
            <div key={i} className="multi-input-row">
              <div className="row">
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => handleMobileChange(i, e.target.value)}
                  placeholder="Mobile Number"
                />
                {formData?.mobileNumbers?.length > 1 && (
                  <IoMdRemove
                    onClick={() => removeMobile(i)}
                    className="icon-btn remove-icon"
                    title="Remove mobile number"
                  />
                )}
              </div>
            </div>
          ))}
        </label>

        <label>
          Addresses:
          <IoMdAdd
            onClick={addAddress}
            className="icon-btn"
            title="Add mobile number"
          />
          {formData?.addresses?.map((address, i) => (
            <div key={i} className="addresses">
              <div className="address-block">
                <input
                  type="text"
                  placeholder="Address Line 1"
                  value={address?.addressLine1}
                  onChange={(e) =>
                    handleAddressChange(i, "addressLine1", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Address Line 2"
                  value={address?.addressLine2}
                  onChange={(e) =>
                    handleAddressChange(i, "addressLine2", e.target.value)
                  }
                />
                <select
                  value={address?.country}
                  onChange={(e) =>
                    handleAddressChange(i, "country", e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Country
                  </option>
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>

                <select
                  value={address?.city}
                  onChange={(e) =>
                    handleAddressChange(i, "city", e.target.value)
                  }
                  disabled={!address.country}
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  {locations
                    .find((loc) => loc.name === address.country)
                    ?.cities.map((city) => (
                      <option key={city.id} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                </select>
              </div>
              {formData.addresses.length > 1 && (
                <IoMdRemove
                  onClick={() => removeAddress(i)}
                  className="icon-btn remove-icon"
                  title="Remove mobile number"
                />
              )}
            </div>
          ))}
        </label>
        <label>
          Family Members:
          <select
            multiple
            value={formData.familyMemberIds}
            onChange={(e) => {
              const selectedOptions = Array.from(e.target.selectedOptions).map(
                (option) => option.value
              );
              setFormData({ ...formData, familyMemberIds: selectedOptions });
            }}
          >
            {familyMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
