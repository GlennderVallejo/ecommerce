package com.glennder.ecommerce.controller;

import com.glennder.ecommerce.dto.CartItemRequest;
import com.glennder.ecommerce.dto.CartItemResponse;
import com.glennder.ecommerce.service.CartService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<CartItemResponse> getCart(Principal principal) {

        return cartService.getCart(principal.getName());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CartItemResponse addItem(
            Principal principal,
            @Valid @RequestBody CartItemRequest request) {

        return cartService.addItem(
                principal.getName(),
                request
        );
    }

    @PutMapping("/{cartItemId}")
    public CartItemResponse updateQuantity(
            Principal principal,
            @PathVariable Long cartItemId,
            @RequestParam @Min(1) Integer quantity) {

        return cartService.updateQuantity(
                principal.getName(),
                cartItemId,
                quantity
        );
    }

    @DeleteMapping("/{cartItemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(
            Principal principal,
            @PathVariable Long cartItemId) {

        cartService.removeItem(
                principal.getName(),
                cartItemId
        );
    }
}