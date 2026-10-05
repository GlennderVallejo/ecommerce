package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.CartItemRequest;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.entity.Role;
import com.glennder.ecommerce.entity.User;
import com.glennder.ecommerce.exception.InsufficientStockException;
import com.glennder.ecommerce.repository.CartItemRepository;
import com.glennder.ecommerce.repository.ProductRepository;
import com.glennder.ecommerce.repository.UserRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void addItemShouldRejectQuantityGreaterThanStock() {

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
                2,
                null
        );
        product.setId(1L);

        CartItemRequest request = new CartItemRequest();
        request.setProductId(1L);
        request.setQuantity(3);

        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(user));

        when(productRepository.findById(1L))
                .thenReturn(Optional.of(product));

        when(cartItemRepository.findByUserIdAndProductId(
                user.getId(),
                product.getId()
        )).thenReturn(Optional.empty());

        assertThrows(
                InsufficientStockException.class,
                () -> cartService.addItem(
                        "test@example.com",
                        request
                )
        );

        verify(cartItemRepository, never()).save(any());
    }
}
