package com.example.sales.models;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.UUID;

@Entity
public class Customer {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    private UUID id;

    public UUID getId(){ return id; }

    public void setId(UUID uid){ this.id = uid; }

    private String name;

    private String mailingAdress;


    public String getName(){ return name; }

    public void setName(String s){ this.name = s; }

    public String getMailingAdress(){ return mailingAdress; }

    public void setMailingAdress(String s){ this.mailingAdress = s; }
}
