package com.glennder.ecommerce.service;

import com.glennder.ecommerce.dto.CategoryRequest;
import com.glennder.ecommerce.dto.CategoryResponse;
import com.glennder.ecommerce.entity.Category;
import com.glennder.ecommerce.exception.CategoryNotFoundException;
import com.glennder.ecommerce.repository.CategoryRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getCategoryById(Long id) {
        return toResponse(findCategoryById(id));
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category(request.getName());
        Category savedCategory = categoryRepository.save(category);

        return toResponse(savedCategory);
    }

    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = findCategoryById(id);

        category.setName(request.getName());

        Category updatedCategory = categoryRepository.save(category);

        return toResponse(updatedCategory);
    }

    public void deleteCategory(Long id) {
        Category category = findCategoryById(id);
        categoryRepository.delete(category);
    }

    private Category findCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException(
                        "Category with id " + id + " not found"
                ));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName()
        );
    }
}