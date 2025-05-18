package com.lakrandi.custman.dto;

import java.util.List;

public class PaginatedCustomersResponse {

    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private List<CustomerDTO> customers;

    public PaginatedCustomersResponse() {}

    public PaginatedCustomersResponse(int currentPage, int pageSize, long totalElements, int totalPages, List<CustomerDTO> customers) {
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.customers = customers;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public List<CustomerDTO> getCustomers() {
        return customers;
    }

    public void setCustomers(List<CustomerDTO> customers) {
        this.customers = customers;
    }
}
