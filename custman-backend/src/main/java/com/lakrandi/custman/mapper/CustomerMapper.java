package com.lakrandi.custman.mapper;

import com.lakrandi.custman.dto.*;
import com.lakrandi.custman.entity.*;
import com.lakrandi.custman.repository.CityRepository;
import com.lakrandi.custman.repository.CountryRepository;
import com.lakrandi.custman.repository.CustomerRepository;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class CustomerMapper {
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final CustomerRepository customerRepository;

    public CustomerMapper(CityRepository cityRepo, CountryRepository countryRepo, CustomerRepository custRepo) {
        this.cityRepository = cityRepo;
        this.countryRepository = countryRepo;
        this.customerRepository = custRepo;
    }

    public static CustomerDTO toDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setName(customer.getName());
        dto.setNic(customer.getNic());
        dto.setDateOfBirth(customer.getDateOfBirth());

        Set<String> numbers = customer.getMobileNumbers().stream()
                .map(MobileNumber::getMobileNumber)
                .collect(Collectors.toSet());

        dto.setMobileNumbers(numbers);

        dto.setAddresses(
                customer.getAddresses().stream()
                        .map(CustomerMapper::toAddressDTO)
                        .collect(Collectors.toSet())
        );

        dto.setFamilyMembers(
                customer.getFamilyMembers().stream()
                        .map(CustomerMapper::toFamilyMemberDTO)
                        .collect(Collectors.toSet())
        );

        return dto;
    }

    public Customer toEntity(CreateCustomerRequest request) {
        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setNic(request.getNic());
        customer.setDateOfBirth(request.getDateOfBirth());

        // Set mobile numbers
        Set<MobileNumber> mobileNumbers = request.getMobileNumbers().stream()
                .map(number -> {
                    MobileNumber mobile = new MobileNumber();
                    mobile.setMobileNumber(number);
                    mobile.setCustomer(customer);
                    return mobile;
                }).collect(Collectors.toSet());
        customer.setMobileNumbers(mobileNumbers);

        // Map addresses
        if (request.getAddresses() != null) {
            Set<Address> addresses = request.getAddresses().stream()
                    .map(addrReq -> {
                        Country country = countryRepository.findByName(addrReq.getCountry())
                                .orElseThrow(() -> new RuntimeException(("Country not found:" + addrReq.getCountry())));
                        City city = cityRepository.findByName(addrReq.getCity())
                                .orElseThrow(() -> new RuntimeException("City not found: " + addrReq.getCity()));
                        Address addr = new Address();
                        addr.setAddressLine1(addrReq.getAddressLine1());
                        addr.setAddressLine2(addrReq.getAddressLine2());
                        addr.setCity(city);
                        addr.setCountry(country);
                        addr.setCustomer(customer);
                        return addr;
                    }).collect(Collectors.toSet());

            customer.setAddresses(addresses);
        }

        // Map family member IDs
        if (request.getFamilyMemberIds() != null) {
            Set<Customer> familyMembers = request.getFamilyMemberIds().stream()
                    .map(id -> customerRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Family member not found with ID: " + id)))
                    .collect(Collectors.toSet());

            customer.setFamilyMembers(familyMembers);
        }

        return customer;
    }

    public void updateEntity(Customer customer, UpdateCustomerRequest request) {
        customer.setName(request.getName());
        customer.setNic(request.getNic());
        customer.setDateOfBirth(request.getDateOfBirth());

        // Set mobile numbers
        Set<MobileNumber> mobileNumbers = request.getMobileNumbers().stream()
                .map(number -> {
                    MobileNumber mobile = new MobileNumber();
                    mobile.setMobileNumber(number);
                    mobile.setCustomer(customer);
                    return mobile;
                }).collect(Collectors.toSet());
        customer.setMobileNumbers(mobileNumbers);

        // Clear and re-map addresses
        customer.getAddresses().clear();
        if (request.getAddresses() != null) {
            Set<Address> newAddresses = request.getAddresses().stream()
                    .map(addrReq -> {
                        Country country = countryRepository.findByName(addrReq.getCountry())
                                .orElseThrow(() -> new RuntimeException(("Country not found:" + addrReq.getCountry())));
                        City city = cityRepository.findByName(addrReq.getCity())
                                .orElseThrow(() -> new RuntimeException("City not found: " + addrReq.getCity()));
                        Address addr = new Address();
                        addr.setAddressLine1(addrReq.getAddressLine1());
                        addr.setAddressLine2(addrReq.getAddressLine2());
                        addr.setCity(city);
                        addr.setCountry(country);
                        addr.setCustomer(customer);
                        return addr;
                    }).collect(Collectors.toSet());

            customer.getAddresses().addAll(newAddresses);
        }

        // Replace family members
        customer.getFamilyMembers().clear();
        if (request.getFamilyMemberIds() != null) {
            Set<Customer> newFamily = request.getFamilyMemberIds().stream()
                    .map(id -> customerRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Family member not found with ID: " + id)))
                    .collect(Collectors.toSet());

            customer.getFamilyMembers().addAll(newFamily);
        }
    }

    private static AddressDTO toAddressDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setAddressLine1(address.getAddressLine1());
        dto.setAddressLine2(address.getAddressLine2());
        dto.setCity(address.getCity().getName());
        dto.setCountry(address.getCountry().getName());
        return dto;
    }

    private static FamilyMemberDTO toFamilyMemberDTO(Customer member) {
        FamilyMemberDTO dto = new FamilyMemberDTO();
        dto.setId(member.getId());
        dto.setName(member.getName());
        dto.setNic(member.getNic());
        dto.setDateOfBirth(member.getDateOfBirth());
        return dto;
    }
}