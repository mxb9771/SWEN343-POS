package com.example.sales.controllers;
import com.example.sales.repositories.SalesOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping(path="/commission")
public class CommissionController {

    @Autowired
    private SalesOrderRepository salesOrderRepository;

    @PostMapping(path="")
    public @ResponseBody Double calculateCommission(@RequestBody Map<String, Object> body) {
        double commission = 0;

        String empId = body.get("empId").toString();
        String startDate = body.get("startDate").toString();
        String endDate = body.get("endDate").toString();


        System.out.println("Commission calculation requested for Employee ID: " + empId);
        System.out.println("Between the dates: "  + startDate);
        System.out.println("and: " + endDate);


        // First fina all Sales Orders with this sales_person_id and add to toal
        String totalSalesBySalesPerson = salesOrderRepository.findTotalSalesBySalesPersonId(Integer.parseInt(empId));
        if (totalSalesBySalesPerson != null) {
            double rep_commission = Double.parseDouble(totalSalesBySalesPerson) * 0.03;
            System.out.println("Sales Rep commission found: $" + rep_commission);
            commission += rep_commission;
        } else {
            System.out.println("No Sales Orders found with this employee as sales person");
        }

        // First fina all Sales Orders with this sales_manager_id and add to toal
        String totalSalesBySalesManager = salesOrderRepository.findTotalSalesBySalesManagerId(Integer.parseInt(empId));
        if (totalSalesBySalesManager != null) {
            double manager_commission = Double.parseDouble(totalSalesBySalesManager) * 0.01;
            System.out.println("Sales Manager commission found: $" + manager_commission);
            commission += manager_commission;
        } else {
            System.out.println("No Sales Orders found with this employee as sales manager");
        }

        // If heartbeat works, add some concept of pay period, get all sales orders between X and Y

        System.out.println("Total Commission: $" + commission);
        return commission;
    }

}