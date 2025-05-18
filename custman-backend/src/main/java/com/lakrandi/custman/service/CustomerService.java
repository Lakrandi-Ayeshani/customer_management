package com.lakrandi.custman.service;

import com.lakrandi.custman.dto.*;
import com.lakrandi.custman.entity.*;
import com.lakrandi.custman.mapper.CustomerMapper;
import com.lakrandi.custman.repository.CityRepository;
import com.lakrandi.custman.repository.CountryRepository;
import com.lakrandi.custman.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);
    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper, CityRepository cityRepository, CountryRepository countryRepository) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
    }

    public PaginatedCustomersResponse getAllCustomers(String query, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Customer> customerPage;

        if (query != null && !query.trim().isEmpty()) {
            customerPage = customerRepository.searchByNameOrNic(query.trim(), pageRequest);
        } else {
            customerPage = customerRepository.findAll(pageRequest);
        }

        List<CustomerDTO> customers = customerPage.getContent()
                .stream()
                .map(CustomerMapper::toDTO)
                .collect(Collectors.toList());

        return new PaginatedCustomersResponse(
                customerPage.getNumber(),
                customerPage.getSize(),
                customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customers
        );
    }

    public CustomerDTO getCustomerById(Long id) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        return customerOpt.map(CustomerMapper::toDTO).orElse(null);
    }

    public CustomerDTO createCustomer(CreateCustomerRequest customer) {
        Customer customerEntity = customerMapper.toEntity(customer);
        log.info("[CustomerService:createCustomer] Mapped entity: {}", customerEntity.toString());
        customerRepository.save(customerEntity);
        return CustomerMapper.toDTO(customerEntity);
    }

    public CustomerDTO updateCustomer(Long id, UpdateCustomerRequest updatedCustomer) {
        Optional<Customer> customerOpt = customerRepository.findById(id);
        if (!customerOpt.isPresent()) {
            return null;
        }

        // Update basic data
        Customer existingCustomer = customerOpt.get();
        existingCustomer.setName(updatedCustomer.getName());
        existingCustomer.setNic(updatedCustomer.getNic());
        existingCustomer.setDateOfBirth(updatedCustomer.getDateOfBirth());

        // Update mobile numbers
        Set<MobileNumber> mobileNumbers = existingCustomer.getMobileNumbers();
        mobileNumbers.clear();
        for (String mobileNumber: updatedCustomer.getMobileNumbers()) {
            MobileNumber newMobileNumber = new MobileNumber();
            newMobileNumber.setCustomer(existingCustomer);
            newMobileNumber.setMobileNumber(mobileNumber);
            mobileNumbers.add(newMobileNumber);
        }

        // Update addresses
        Set<Address> addresses = existingCustomer.getAddresses();
        addresses.clear();
        for (CreateAddressRequest address: updatedCustomer.getAddresses()) {
            Address newAddress = new Address();
            newAddress.setCustomer(existingCustomer);
            newAddress.setAddressLine1(address.getAddressLine1());
            newAddress.setAddressLine2(address.getAddressLine2());

            City city = cityRepository.findByName(address.getCity())
                    .orElseThrow(() -> new RuntimeException("City not found"));
            newAddress.setCity(city);
            Country country = countryRepository.findByName(address.getCountry())
                    .orElseThrow(() -> new RuntimeException("Country not found"));
            newAddress.setCountry(country);

            addresses.add(newAddress);
        }

        // Update family members
        Set<Customer> familyMembers = new HashSet<>();
        for (Long memberId: updatedCustomer.getFamilyMemberIds()) {
            Customer familyMember = customerRepository.findById(memberId)
                    .orElseThrow(() -> new RuntimeException("Family member with given ID not found"));
            familyMembers.add(familyMember);
        }
        existingCustomer.setFamilyMembers(familyMembers);

        customerRepository.save(existingCustomer);
        return CustomerMapper.toDTO(existingCustomer);
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
