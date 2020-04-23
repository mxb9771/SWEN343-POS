package com.example.sales.repositories;

import com.example.sales.models.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface CustomerRepository extends CrudRepository<Customer, UUID>{
}
