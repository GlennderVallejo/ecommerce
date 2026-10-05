package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.OrderResponse;
import com.glennder.ecommerce.entity.CartItem;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.entity.Role;
import com.glennder.ecommerce.entity.User;
import com.glennder.ecommerce.repository.CartItemRepository;
import com.glennder.ecommerce.repository.OrderRepository;
import com.glennder.ecommerce.repository.ProductRepository;
import com.glennder.ecommerce.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void checkoutShouldCreateOrderDecreaseStockAndClearCart() {

        User user = new User(
                "Test User",
                "test@example.com",
                "password",
                Role.USER
        );

        Product product = new Product(
                "Keyboard",
                "Mechanical keyboard",
                new BigDecimal("50.00"),
                5,
                null
        );
        product.setId(1L);

        CartItem cartItem = new CartItem(
                user,
                product,
                2
        );

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(cartItemRepository.findByUserId(user.getId()))
                .thenReturn(List.of(cartItem));

        when(orderRepository.save(any()))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response
                = orderService.checkout("test@example.com");

        assertEquals(
                new BigDecimal("100.00"),
                response.getTotal()
        );

        assertEquals(3, product.getStock());
        assertEquals(1, response.getItems().size());

        verify(productRepository).save(product);
        verify(orderRepository).save(any());
        verify(cartItemRepository).deleteByUserId(user.getId());
    }
}
