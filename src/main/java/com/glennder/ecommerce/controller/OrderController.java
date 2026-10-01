package com.glennder.ecommerce.controller;

import com.glennder.ecommerce.dto.OrderResponse;
import com.glennder.ecommerce.service.OrderService;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(Principal principal) {
        return orderService.checkout(principal.getName());
    }

    @GetMapping
    public List<OrderResponse> getMyOrders(Principal principal) {
        return orderService.getMyOrders(principal.getName());
    }

    @GetMapping("/{orderId}")
    public OrderResponse getMyOrder(
            Principal principal,
            @PathVariable Long orderId) {

        return orderService.getMyOrder(
                principal.getName(),
                orderId
        );
    }
}