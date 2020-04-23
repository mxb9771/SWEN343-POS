package com.example.sales.models;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Product {

    //the id can't be prim so i made this a string?
    @Id
    private String id;

    private String name;

    private int price;

    private int stock;

    public void setId(String i){ this.id = i; }

    public String getId(){ return this.id; }

    public void setName(String name){ this.name = name; }

    public String getName(){ return this.name; }

    public void setPrice(int price) { this.price = price; }

    public int getPrice()  { return this.price; }

    public void setStock(int i){ this.stock = i; }

    public int getStock() {return this.stock;}


}
