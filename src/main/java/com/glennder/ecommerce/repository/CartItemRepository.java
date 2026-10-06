package com.glennder.ecommerce.repository;

import com.glennder.ecommerce.entity.CartItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    List<CartItem> findByUserIdOrderByIdAsc(Long userId);

    Optional<CartItem> findByUserIdAndProductId(
            Long userId,
            Long productId
    );

    Optional<CartItem> findByIdAndUserId(
            Long id,
            Long userId
    );

    void deleteByUserId(Long userId);
}