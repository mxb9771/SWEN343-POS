package com.example.sales.repositories;

import org.springframework.data.repository.CrudRepository;

import com.example.sales.models.OrderItem;

import java.util.UUID;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface OrderItemRepository extends CrudRepository<OrderItem, UUID> {

}