package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.ProductRequest;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(ProductRequest request) {

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStock()
        );

        return productRepository.save(product);
    }
}
