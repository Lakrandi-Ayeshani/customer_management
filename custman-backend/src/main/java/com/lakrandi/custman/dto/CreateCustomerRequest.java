package com.lakrandi.custman.dto;

import java.time.LocalDate;
import java.util.Set;

public class CreateCustomerRequest {
    private String name;
    private String nic;
    private LocalDate dateOfBirth;
    private Set<String> mobileNumbers;

    private Set<CreateAddressRequest> addresses;
    private Set<Long> familyMemberIds; // Referencing existing customers by ID

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Set<String> getMobileNumbers() {
        return mobileNumbers;
    }

    public void setMobileNumbers(Set<String> mobileNumbers) {
        this.mobileNumbers = mobileNumbers;
    }

    public Set<CreateAddressRequest> getAddresses() {
        return addresses;
    }

    public void setAddresses(Set<CreateAddressRequest> addresses) {
        this.addresses = addresses;
    }

    public Set<Long> getFamilyMemberIds() {
        return familyMemberIds;
    }

    public void setFamilyMemberIds(Set<Long> familyMemberIds) {
        this.familyMemberIds = familyMemberIds;
    }

    @Override
    public String toString() {
        return "CreateCustomerRequest{" +
                "name='" + name + '\'' +
                ", nic='" + nic + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", mobileNumbers=" + mobileNumbers +
                ", addresses=" + addresses +
                ", familyMemberIds=" + familyMemberIds +
                '}';
    }

}
