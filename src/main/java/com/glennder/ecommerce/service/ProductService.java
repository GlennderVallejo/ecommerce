package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.ProductRequest;
import com.glennder.ecommerce.dto.ProductResponse;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.exception.ProductNotFoundException;
import com.glennder.ecommerce.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import com.glennder.ecommerce.entity.Category;
import com.glennder.ecommerce.exception.CategoryNotFoundException;
import com.glennder.ecommerce.repository.CategoryRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = findProductById(id);
        return toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Category category = findCategoryById(request.getCategoryId());

        Product product = new Product(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getStock(),
                category
        );

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductById(id);
        Category category = findCategoryById(request.getCategoryId());

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);

        Product updatedProduct = productRepository.save(product);

        return toResponse(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        "Product with id " + id + " not found"
                ));
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(
                        "Category with id " + id + " not found"
                ));
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );
    }
}
