import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerList from "./pages/CustomerList";
import BulkUpload from "./pages/BulkUpload";
import CustomerForm from "./components/CustomerForm";
import CustomerView from "./components/customerView/CustomerView";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<CustomerList  />} />
        <Route path="/addCustomer" element={<CustomerForm />} />
        <Route path="/customer/:id" element={<CustomerView />} />
        <Route path="/editCustomer/:id" element={<CustomerForm />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
