package com.example.sales.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.UUID;

@Entity
public class OrderItem {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "id", updatable = false, nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    private String itemId;

    private int quantity;

    private double pricePer;

    private UUID saleId;

    public String getItemId() { return itemId; }

    public void setItemId(String id) { this.itemId = id; }

    public double getPricePer() { return pricePer; }

    public void setPricePer(double pricePer) { this.pricePer = pricePer; }

    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { this.quantity = quantity; }

    public UUID getSaleId() {
        return saleId;
    }

    public void setSaleId(UUID saleId) {
        this.saleId = saleId;
    }
}