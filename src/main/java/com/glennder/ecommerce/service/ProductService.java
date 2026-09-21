package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.ProductRequest;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.exception.ProductNotFoundException;
import com.glennder.ecommerce.repository.ProductRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product with id " + id + " not found"
                ));
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

    public Product updateProduct(Long id, ProductRequest request) {

        Product product = getProductById(id);

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        return productRepository.save(product);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
