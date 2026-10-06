package com.glennder.ecommerce.config;

import com.glennder.ecommerce.entity.Category;
import com.glennder.ecommerce.entity.Product;
import com.glennder.ecommerce.repository.CategoryRepository;
import com.glennder.ecommerce.repository.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedCatalog(
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {

        return args -> {

            if (productRepository.count() != 1) {
                return;
            }

            Product existingProduct = productRepository.findAll().get(0);

            if (!existingProduct.getName().equalsIgnoreCase("hola")) {
                return;
            }

            Category electronics = findOrCreateCategory(
                    categoryRepository,
                    "Electronics"
            );

            Category processors = findOrCreateCategory(
                    categoryRepository,
                    "Processors"
            );

            Category motherboards = findOrCreateCategory(
                    categoryRepository,
                    "Motherboards"
            );

            Category peripherals = findOrCreateCategory(
                    categoryRepository,
                    "Peripherals"
            );

            Category cases = findOrCreateCategory(
                    categoryRepository,
                    "Cases"
            );

            // Reuse the old test product instead of deleting it,
            // because historical order items reference its ID.
            existingProduct.setName("GeForce RTX 4070");
            existingProduct.setDescription(
                    "ZOTAC GAMING graphics card built for high-performance gaming."
            );
            existingProduct.setPrice(new BigDecimal("429900.00"));
            existingProduct.setStock(8);
            existingProduct.setCategory(electronics);

            productRepository.save(existingProduct);

            productRepository.save(new Product(
                    "Ryzen 5 5600X",
                    "AMD 6-core desktop processor for gaming and productivity.",
                    new BigDecimal("89900.00"),
                    15,
                    processors
            ));

            productRepository.save(new Product(
                    "B850 Gaming WiFi6",
                    "GIGABYTE gaming motherboard with WiFi 6 connectivity.",
                    new BigDecimal("119900.00"),
                    10,
                    motherboards
            ));

            productRepository.save(new Product(
                    "Rival 5",
                    "SteelSeries gaming mouse designed for precise control.",
                    new BigDecimal("39900.00"),
                    20,
                    peripherals
            ));

            productRepository.save(new Product(
                    "Apex 100",
                    "SteelSeries gaming keyboard with responsive controls.",
                    new BigDecimal("34900.00"),
                    18,
                    peripherals
            ));

            productRepository.save(new Product(
                    "AX20 RGB Elite",
                    "Antec airflow-focused gaming case with RGB cooling.",
                    new BigDecimal("42900.00"),
                    12,
                    cases
            ));

            System.out.println(
                    "PARDRIT development catalog seeded successfully."
            );
        };
    }

    private Category findOrCreateCategory(
            CategoryRepository categoryRepository,
            String name) {

        return categoryRepository.findAll()
                .stream()
                .filter(category ->
                        category.getName().equalsIgnoreCase(name)
                )
                .findFirst()
                .orElseGet(() ->
                        categoryRepository.save(
                                new Category(name)
                        )
                );
    }
}