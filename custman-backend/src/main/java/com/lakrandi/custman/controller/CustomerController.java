package com.lakrandi.custman.controller;

import com.lakrandi.custman.dto.CreateCustomerRequest;
import com.lakrandi.custman.dto.CustomerDTO;
import com.lakrandi.custman.dto.PaginatedCustomersResponse;
import com.lakrandi.custman.dto.UpdateCustomerRequest;
import com.lakrandi.custman.service.CustomerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    private static final Logger log = LoggerFactory.getLogger(CustomerController.class);
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // GET all customers or search
    @GetMapping
    public ResponseEntity<PaginatedCustomersResponse> getAllCustomers(
            @RequestParam(value = "q", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        PaginatedCustomersResponse response = customerService.getAllCustomers(query, page, size);
        return ResponseEntity.ok(response);
    }

    // GET by ID
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long id) {
        CustomerDTO customer = customerService.getCustomerById(id);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customer);
    }

    // CREATE
    @PostMapping
    public ResponseEntity<CustomerDTO> createCustomer(@RequestBody CreateCustomerRequest customer) {
        log.info("[CustomerController:createCustomer] Input data: {}", customer.toString());
        return ResponseEntity.ok(customerService.createCustomer(customer));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable Long id, @RequestBody UpdateCustomerRequest customer) {
        log.info("[CustomerController:updateCustomer] Input data: {}", customer.toString());
        CustomerDTO updatedCustomer = customerService.updateCustomer(id, customer);
        if (updatedCustomer == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedCustomer);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
