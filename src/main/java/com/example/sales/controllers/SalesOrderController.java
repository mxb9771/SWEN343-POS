package com.example.sales.controllers;
import com.example.sales.models.Customer;
import com.example.sales.models.SalesOrder;
import com.example.sales.models.OrderItem;
import com.example.sales.repositories.CustomerRepository;
import com.example.sales.repositories.SalesOrderRepository;
import com.example.sales.repositories.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.rmi.server.ExportException;
import java.util.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Controller // This means that this class is a Controller
@RequestMapping(path="/order") // This means URL's start with /demo (after Application path)
public class SalesOrderController {

    private final String refundUrl = "https://accountingwebapp.azurewebsites.net/request";
    private final String depositUrl = "https://accountingwebapp.azurewebsites.net/deposit";

    //TODO IMPLEMENT THIS STUBED ACCOUNTING CONTROLLER
    private AccountingController accountingController = new AccountingController();

    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private SalesOrderRepository salesOrderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    @PostMapping(path="/add") // Map ONLY POST Requests
    public @ResponseBody UUID addNewOrder (@RequestBody Map<String, Object> body) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        SalesOrder salesOrder = new SalesOrder();
        Customer customer = new Customer();

        String salesPersonId = body.get("salesPersonId").toString();
        if (salesPersonId.equals("")){
            salesOrder.setSalesPersonId(null);
        } else {
            salesOrder.setSalesPersonId(Integer.parseInt(salesPersonId));
        }
        String salesManagerId = body.get("salesManagerId").toString();
        if (salesManagerId.equals("")){
            salesOrder.setSalesManagerId(null);
        } else {
            salesOrder.setSalesManagerId(Integer.parseInt(salesManagerId));
        }
        salesOrder.setTotalPrice(Double.parseDouble(body.get("totalPrice").toString()));
        salesOrder.setNetProfit(Double.parseDouble(body.get("netProfit").toString()));



        //Create order items in the DB
        for (Object item : ((ArrayList)body.get("itemList"))) {
            OrderItem oi = new OrderItem();
            LinkedHashMap<String, Object> m = (LinkedHashMap<String, Object>)item;
            oi.setItemId((String) m.get("itemId"));
            oi.setPricePer(Double.parseDouble(m.get("pricePer").toString()));
            oi.setQuantity((int) m.get("quantity"));
            oi.setSaleId(salesOrder.getId());
            orderItemRepository.save(oi);
        }

        //Making deposit call to accounting
        try {
            //var response = accountingController.depositPost(depositUrl, body.get("totalPrice").toString());
            accountingController.depositPost(depositUrl, body.get("totalPrice").toString());
        }
        catch (Exception e ){
            e.printStackTrace();
            System.out.println("[LOG] There was an error when sending deposit to accounting");
        }

        customer.setName(body.get("name").toString());
        customer.setMailingAdress(body.get("address").toString());
        Customer savedCustomer = customerRepository.save(customer);
        salesOrder.setCustomerId(savedCustomer.getId());
        salesOrder.setOrderStatus("Pending");

        salesOrderRepository.save(salesOrder);
        return salesOrder.getId();
    }

    @PostMapping(path="/rma")
    public @ResponseBody String processRMA(@RequestBody Map<String, Object> body) {
        String orderId = body.get("orderId").toString();
        String refund = "https://accountingwebapp.azurewebsites.net/deposit";

        System.out.println("RMA requested for Order ID: " + orderId);

        // Check if Order ID exists
        SalesOrder order = salesOrderRepository.findById(UUID.fromString(orderId))
                .orElse(null);

        if (order != null){
            // Make sure the order has not already been refunded
            String orderStatus = order.getOrderStatus();
            System.out.println("Order Status: "+ orderStatus);
            if (orderStatus != null) {
                if (orderStatus.equals("Out for RMA")) {
                    return "This Order is already out for RMA.";
                } else if (orderStatus.equals("Refunded") || orderStatus.equals("RMA Complete")) {
                    return "This Order has already been refunded.";
                }
            }

            // Order is valid for rma, determine if it is B2C or B2B
            // by checking if there was a Sales Rep on the Order
            if (order.getSalesPersonId() == null){
                // This is a B2C Refund

                // Get Order total price
                double totalRefund = order.getTotalPrice();

                // Request total refund amount from Accounting
                try {
                    accountingController.refundPost(refundUrl, "" + order.getTotalPrice());
                }
                catch (Exception e){
                    System.out.println("[LOG] There was a problem with refund API");
                    e.printStackTrace();
                }
                // Set Order Status to "Refunded"
                order.setOrderStatus("Refunded");
                salesOrderRepository.save(order);
                System.out.println("Order ID: " + orderId + " marked as Refunded");

                System.out.println("B2C Refund completed for Order ID: " + orderId);
                return "Total Refund: $" + totalRefund;

            }
            else {
                // This is a B2B RMA request (we don't refund B2B sales)

                // ******* STUBBED IMPLEMENTATION *******
                System.out.println(this.requestRMAStub(orderId));

                // Set Order Status to "Out for RMA"
                order.setOrderStatus("Out for RMA");
                salesOrderRepository.save(order);
                System.out.println("Order ID: " + orderId + " marked as Out for RMA");

                return "B2B Order has been sent out for RMA";
            }
        }
        else return "Order ID not found";

    }

    @GetMapping(path="/all")
    public @ResponseBody Iterable<SalesOrder> getAllSalesOrders() {
        // This returns a JSON or XML with the users
        return salesOrderRepository.findAll();
    }

    @PostMapping(path="/status")
    public @ResponseBody String getOrUpdateStatus(@RequestBody Map<String, Object> body) {
        String orderId = body.get("orderId").toString();
        Object statusToUpdate = body.get("status");


        // Check if Order ID exists
        SalesOrder order = salesOrderRepository.findById(UUID.fromString(orderId))
                .orElse(null);

        if (order != null){
            if (statusToUpdate == null){
                // This is a request to get the status
                System.out.println("Order Status requested for Order ID: " + orderId);
                return order.getOrderStatus();
            }
            else {
                // This is a request to update the status
                System.out.println("Order Status update requested for Order ID: " + orderId);
                order.setOrderStatus(statusToUpdate.toString());
                salesOrderRepository.save(order);
                return "Order Status updated successfully for Order ID: " + orderId;
            }
        }
        else return "Order ID not found";
    }


    @GetMapping(path="/stats")
    public @ResponseBody String getSalesStatistics() {
        String jsonResponse = "{";
        List<SalesOrder> sales = new ArrayList<>();
        List<OrderItem> orders = new ArrayList<>();
        salesOrderRepository.findAll().forEach(sales::add);
        orderItemRepository.findAll().forEach(orders::add);

        //Gets the top item sold
        HashMap<String, Integer> topItemMap = new HashMap<String, Integer>();
        for (OrderItem thisItem : orders) {
            String thisID = thisItem.getItemId();
            if (topItemMap.containsKey(thisID))
                topItemMap.put(thisID, topItemMap.get(thisID) + 1);
            else
                topItemMap.put(thisID, 1);
        }
        String top = "";
        for (String key : topItemMap.keySet()){
            if (top.equals(""))
                top = key; //Ensure no empty checks
            if (topItemMap.get(key) > topItemMap.get(top) || top.equals(""))
                top = key;
        }
        //END TOP ITEM

        int gross_profits = 0;
        int net_profits = 0;
        for (SalesOrder sale : sales) {
            gross_profits += sale.getTotalPrice();
            net_profits += sale.getNetProfit();
        }

        jsonResponse += "\"sale_count\":" + sales.size() + ",";
        //jsonResponse += "top_item':'" + top + "',";
        jsonResponse += "\"gross_profits\":" + gross_profits + ",";
        jsonResponse += "\"net_profits\":" + net_profits + "}";
        return jsonResponse;
    }

    // This is a stubbed functionality to replace our silo requesting the Manufacturing API
    public String requestRMAStub(String orderID){
        // ******** STUBBED API CALL *********
        // TODO make an http request to Manufacturing endpoint for RMA request with object ID
        // Will be implemented in R3
        return "STUB: RMA for Order ID: " + orderID + " has begun. Your Order Status will be updated when it is complete. " +
                "Thank you for shopping with KennUWare";
    }

    // This is a stubbed functionality to replace Manufacturing Silo hitting our order/status
    // endpoint to update an order to "RMA Complete"
    @PostMapping(path="/completeRMA")
    public @ResponseBody String completeRMAStub(@RequestBody Map<String, Object> body){
        String orderId = body.get("orderId").toString();
        SalesOrder order = salesOrderRepository.findById(UUID.fromString(orderId))
                .orElse(null);
        order.setOrderStatus("RMA Complete");
        salesOrderRepository.save(order);
        return "RMA Complete for Order ID: " + orderId;
    }
}