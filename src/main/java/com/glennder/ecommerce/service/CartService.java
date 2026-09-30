package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.CartItemRequest;
import com.glennder.ecommerce.dto.CartItemResponse;
import com.glennder.ecommerce.entity.CartItem;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.entity.User;
import com.glennder.ecommerce.exception.CartItemNotFoundException;
import com.glennder.ecommerce.exception.InsufficientStockException;
import com.glennder.ecommerce.exception.ProductNotFoundException;
import com.glennder.ecommerce.repository.CartItemRepository;
import com.glennder.ecommerce.repository.ProductRepository;
import com.glennder.ecommerce.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(
            CartItemRepository cartItemRepository,
            ProductRepository productRepository,
            UserRepository userRepository) {

        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<CartItemResponse> getCart(String email) {

        User user = findUserByEmail(email);

        return cartItemRepository.findByUserId(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CartItemResponse addItem(
            String email,
            CartItemRequest request) {

        User user = findUserByEmail(email);

        Product product = productRepository
                .findById(request.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product with id "
                        + request.getProductId()
                        + " not found"
                ));

        CartItem cartItem = cartItemRepository
                .findByUserIdAndProductId(
                        user.getId(),
                        product.getId()
                )
                .orElse(
                        new CartItem(user, product, 0)
                );

        int newQuantity
                = cartItem.getQuantity() + request.getQuantity();

        validateStock(product, newQuantity);

        cartItem.setQuantity(newQuantity);

        return toResponse(cartItemRepository.save(cartItem));
    }

    public CartItemResponse updateQuantity(
            String email,
            Long cartItemId,
            Integer quantity) {

        User user = findUserByEmail(email);

        CartItem cartItem = cartItemRepository
                .findByIdAndUserId(cartItemId, user.getId())
                .orElseThrow(() -> new CartItemNotFoundException(
                        "Cart item not found"
                ));

        validateStock(cartItem.getProduct(), quantity);

        cartItem.setQuantity(quantity);

        return toResponse(cartItemRepository.save(cartItem));
    }

    public void removeItem(String email, Long cartItemId) {

        User user = findUserByEmail(email);

        CartItem cartItem = cartItemRepository
                .findByIdAndUserId(cartItemId, user.getId())
                .orElseThrow(() -> new CartItemNotFoundException(
                        "Cart item not found"
                ));

        cartItemRepository.delete(cartItem);
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(()
                        -> new IllegalArgumentException(
                                "Authenticated user not found"
                        ));
    }

    private CartItemResponse toResponse(CartItem cartItem) {

        BigDecimal subtotal = cartItem.getProduct()
                .getPrice()
                .multiply(
                        BigDecimal.valueOf(cartItem.getQuantity())
                );

        return new CartItemResponse(
                cartItem.getId(),
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                cartItem.getProduct().getPrice(),
                cartItem.getQuantity(),
                subtotal
        );
    }

    private void validateStock(Product product, int quantity) {

        if (quantity > product.getStock()) {
            throw new InsufficientStockException(
                    "Only " + product.getStock()
                    + " units available for product "
                    + product.getName()
            );
        }
    }
}
