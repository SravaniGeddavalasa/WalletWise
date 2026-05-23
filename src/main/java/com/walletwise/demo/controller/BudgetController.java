package com.walletwise.demo.controller;

import com.walletwise.demo.dto.ApiResponse;
import com.walletwise.demo.dto.BudgetRequest;
import com.walletwise.demo.dto.BudgetResponse;
import com.walletwise.demo.entity.Budget;
import com.walletwise.demo.entity.User;
import com.walletwise.demo.repository.BudgetRepository;
import com.walletwise.demo.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private static final Logger log = LoggerFactory.getLogger(BudgetController.class);

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetResponse>>> getBudgets(
            @RequestHeader("Authorization") String token) {
        try {
            User user = userService.getUserByToken(token);
            List<Budget> budgets = budgetRepository.findByUser(user);
            List<BudgetResponse> responses = budgets.stream()
                    .map(b -> new BudgetResponse(b.getId(), b.getCategory(), b.getLimit() != null ? b.getLimit() : java.math.BigDecimal.ZERO, b.getPeriod()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse<>(true, "Budgets fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PutMapping
    public ResponseEntity<ApiResponse<BudgetResponse>> updateBudget(
            @RequestHeader("Authorization") String token,
            @RequestBody BudgetRequest request) {
        log.info("Received request to create/update budget for category: {}", request.getCategory());
        try {
            User user = userService.getUserByToken(token);
            
            // Check if budget exists for the user and category (case-insensitive)
            Optional<Budget> budgetOpt = budgetRepository.findByUserAndCategoryIgnoreCase(user, request.getCategory());
            Budget budget;
            if (budgetOpt.isPresent()) {
                budget = budgetOpt.get();
                budget.setLimit(request.getLimit() != null ? request.getLimit() : java.math.BigDecimal.ZERO);
                if (request.getPeriod() != null) {
                    budget.setPeriod(request.getPeriod());
                }
            } else {
                budget = new Budget();
                budget.setCategory(request.getCategory());
                budget.setLimit(request.getLimit() != null ? request.getLimit() : java.math.BigDecimal.ZERO);
                budget.setPeriod(request.getPeriod() != null ? request.getPeriod() : "monthly");
                budget.setUser(user);
            }

            budget = budgetRepository.save(budget);
            log.info("Budget record saved successfully to database. ID: {}", budget.getId());

            BudgetResponse response = new BudgetResponse(
                    budget.getId(),
                    budget.getCategory(),
                    budget.getLimit() != null ? budget.getLimit() : java.math.BigDecimal.ZERO,
                    budget.getPeriod()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, "Budget saved successfully", response));
        } catch (Exception e) {
            log.error("Failed to save budget record. Error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id) {
        try {
            User user = userService.getUserByToken(token);
            Budget budget = budgetRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Budget limit not found"));

            if (!budget.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "You do not have permission to delete this entry", null));
            }

            budgetRepository.delete(budget);
            return ResponseEntity.ok(new ApiResponse<>(true, "Budget deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
