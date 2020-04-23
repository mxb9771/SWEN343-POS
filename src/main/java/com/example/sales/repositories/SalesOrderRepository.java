package com.example.sales.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.example.sales.models.SalesOrder;

import java.util.List;
import java.util.UUID;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface SalesOrderRepository extends CrudRepository<SalesOrder, UUID> {

    @Query("SELECT SUM(totalPrice) FROM SalesOrder WHERE salesPersonId = ?1")
    String findTotalSalesBySalesPersonId(Integer sales_person_id);

    @Query("SELECT SUM(totalPrice) FROM SalesOrder WHERE salesManagerId = ?1")
    String findTotalSalesBySalesManagerId(Integer sales_manager_id);
}