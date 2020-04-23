package com.example.sales.controllers;

import com.example.sales.models.Product;
import com.example.sales.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping(path="/product")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping(path="/refresh")
    public @ResponseBody Iterable<Product> getAllProducts() {
        //TODO ADD implementation here this auto populates DB
        List<Product> products = testHelp();
        for (Product p : products){
            productRepository.save(p);
        }
        return productRepository.findAll();
    }

    /*
    TODO Remove this method and imolement functionality with other silos
    For Testing Only
     */
    private List<Product> testHelp(){
        List<Product> products = new ArrayList<>();
        Product p0 = new Product();
        Product p1 = new Product();
        Product p2 = new Product();
        Product p3 = new Product();
        p0.setId("0");
        p1.setId("1");
        p2.setId("2");
        p3.setId("3");
        p0.setName("ProductA");
        p1.setName("ProductB");
        p2.setName("ProductC");
        p3.setName("ProductD");
        p0.setPrice(100);
        p1.setPrice(110);
        p2.setPrice(80);
        p3.setPrice(95);
        p0.setStock(5);
        p1.setStock(4);
        p2.setStock(3);
        p3.setStock(6);
        products.add(p0);
        products.add(p1);
        products.add(p2);
        products.add(p3);
        return products;
    }
}
