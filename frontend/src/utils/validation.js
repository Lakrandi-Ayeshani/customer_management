// Name Validation
export function validateName(name) {
  if (!name || name.trim() === "") return "Name is required.";
  if (name.length < 2) return "Name must be at least 2 characters.";
  return null;
}

// Date Validation
export function validateDOB(dob) {
  if (!dob) return "Date of birth is required.";
  const date = new Date(dob);
  if (isNaN(date.getTime())) return "Invalid date format.";
  const today = new Date();
  if (date > today) return "Date of birth cannot be in the future.";
  return null;
}

// NIC validation
export function validateNIC(nic) {
  if (!nic || nic.trim() === "") return "NIC is required.";
  const oldNIC = /^[0-9]{9}[vVxX]$/;
  const newNIC = /^[0-9]{12}$/;
  if (!oldNIC.test(nic) && !newNIC.test(nic)) return "Invalid NIC format.";
  return null;
}

// Mobile Numbers Validation
export function validateMobile(mobiles) {
  if (!mobiles || !Array.isArray(mobiles) || mobiles.length === 0)
    return "At least one mobile number is required.";

  for (let i = 0; i < mobiles.length; i++) {
    const mobile = mobiles[i].trim();
    if (!/^[0-9]{10}$/.test(mobile)) {
      return `Mobile number at position ${
        i + 1
      } is invalid. Should be 10 digits.`;
    }
  }
  return null;
}

// Address Validation
export function validateAddress(addresses) {
  if (addresses?.length === 0) return;
  //   if (!address || typeof address !== "object") return "Address is required.";

  for (let i = 0; i < addresses.length; i++) {
    const { addressLine1, addressLine2, city, country } = addresses[i];

    if (!addressLine1 || addressLine1.trim() === "") return "Address Line 1 is required.";
    if (!addressLine2 || addressLine2.trim() === "") return "Address Line 2 is required.";
    if (!city || city.trim() === "") return "City is required.";
    if (!country || country.trim() === "") return "Country is required.";
  }
  return null;
}

export function validateCustomerForm(data) {
  const errors = {};

  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;

  const dobError = validateDOB(data.dateOfBirth);
  if (dobError) errors.dateOfBirth = dobError;

  const nicError = validateNIC(data.nic);
  if (nicError) errors.nic = nicError;

  const mobileError = validateMobile(data.mobileNumbers);
  if (mobileError) errors.mobileNumbers = mobileError;

  const addressError = validateAddress(data.addresses);
  if (addressError) errors.addresses = addressError;

  return errors;
}
