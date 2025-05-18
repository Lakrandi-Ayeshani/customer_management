import axios from "axios";
import { CUSTOMER_API, COUNTRIES_API } from "../urls/urls";

// Get all customers
export const getCustomers = async () => {
  try {
    const response = await axios.get(CUSTOMER_API);
    return response?.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

// Get a single customer by ID
export const getCustomer = async (id) => {
  try {
    const response = await axios.get(`${CUSTOMER_API}/${id}`);
    console.log(response.data)
    return response?.data;
  } catch (error) {
    console.error(`Error fetching customer with ID ${id}:`, error);
    throw error;
  }
};

// Create a new customer
export const createCustomer = async (data) => {
  console.log(data);
  try {
    const response = await axios.post(CUSTOMER_API, data);
    console.log(response?.data);
    return response?.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Update existing customer
export const updateCustomer = async (id, data) => {
  try {
    const response = await axios.put(`${CUSTOMER_API}/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${CUSTOMER_API}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    throw error;
  }
};

// Upload customers via Excel file
export const uploadExcel = async (formData) => {
  try {
    const response = await axios.post(`${CUSTOMER_API}/bulk-upload`, formData);
    return response.data;
  } catch (error) {
    console.error("Error uploading Excel file:", error);
    throw error;
  }
};


export const getLocations = async () => {
  try {
    const response = await axios.get(COUNTRIES_API);
    return response?.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};