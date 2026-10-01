package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.OrderItemResponse;
import com.glennder.ecommerce.dto.OrderResponse;
import com.glennder.ecommerce.entity.CartItem;
import com.glennder.ecommerce.entity.Order;
import com.glennder.ecommerce.entity.OrderItem;
import com.glennder.ecommerce.entity.OrderStatus;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.entity.User;
import com.glennder.ecommerce.exception.EmptyCartException;
import com.glennder.ecommerce.exception.InsufficientStockException;
import com.glennder.ecommerce.exception.OrderNotFoundException;
import com.glennder.ecommerce.repository.CartItemRepository;
import com.glennder.ecommerce.repository.OrderRepository;
import com.glennder.ecommerce.repository.ProductRepository;
import com.glennder.ecommerce.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse checkout(String email) {

        User user = findUserByEmail(email);

        List<CartItem> cartItems =
                cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            throw new EmptyCartException(
                    "Cannot checkout an empty cart"
            );
        }

        Order order = new Order(
                user,
                OrderStatus.PENDING,
                BigDecimal.ZERO,
                LocalDateTime.now()
        );

        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {

            Product product = cartItem.getProduct();
            int quantity = cartItem.getQuantity();

            if (quantity > product.getStock()) {
                throw new InsufficientStockException(
                        "Only " + product.getStock()
                        + " units available for product "
                        + product.getName()
                );
            }

            BigDecimal unitPrice = product.getPrice();

            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(quantity)
            );

            OrderItem orderItem = new OrderItem(
                    product,
                    product.getName(),
                    unitPrice,
                    quantity,
                    subtotal
            );

            order.addItem(orderItem);

            total = total.add(subtotal);

            product.setStock(
                    product.getStock() - quantity
            );

            productRepository.save(product);
        }

        order.setTotal(total);

        Order savedOrder = orderRepository.save(order);

        cartItemRepository.deleteByUserId(user.getId());

        return toResponse(savedOrder);
    }

    public List<OrderResponse> getMyOrders(String email) {

        User user = findUserByEmail(email);

        return orderRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public OrderResponse getMyOrder(
            String email,
            Long orderId) {

        User user = findUserByEmail(email);

        Order order = orderRepository
                .findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new OrderNotFoundException(
                        "Order not found"
                ));

        return toResponse(order);
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Authenticated user not found"
                        ));
    }

    private OrderResponse toResponse(Order order) {

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProductName(),
                        item.getUnitPrice(),
                        item.getQuantity(),
                        item.getSubtotal()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotal(),
                order.getCreatedAt(),
                items
        );
    }
}