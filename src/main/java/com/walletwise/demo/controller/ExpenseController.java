package com.walletwise.demo.controller;

import com.walletwise.demo.dto.ApiResponse;
import com.walletwise.demo.dto.ExpenseRequest;
import com.walletwise.demo.dto.ExpenseResponse;
import com.walletwise.demo.entity.Expense;
import com.walletwise.demo.entity.User;
import com.walletwise.demo.repository.ExpenseRepository;
import com.walletwise.demo.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private static final Logger log = LoggerFactory.getLogger(ExpenseController.class);

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getExpenses(
            @RequestHeader("Authorization") String token) {
        try {
            User user = userService.getUserByToken(token);
            List<Expense> expenses = expenseRepository.findByUserOrderByDateDesc(user);
            List<ExpenseResponse> responses = expenses.stream()
                    .map(e -> new ExpenseResponse(e.getId(), e.getTitle(), e.getAmount(), e.getCategory(), e.getDate(), e.getDescription(), e.getReceiptUrl()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse<>(true, "Expenses fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExpenseResponse>> createExpense(
            @RequestHeader("Authorization") String token,
            @RequestBody ExpenseRequest request) {
        log.info("Received request to create expense with title: {}", request.getTitle());
        try {
            User user = userService.getUserByToken(token);
            Expense expense = new Expense();
            expense.setTitle(request.getTitle());
            expense.setAmount(request.getAmount());
            expense.setCategory(request.getCategory());
            expense.setDate(request.getDate());
            expense.setDescription(request.getDescription());
            expense.setReceiptUrl(request.getReceiptUrl());
            expense.setUser(user);

            expense = expenseRepository.save(expense);
            log.info("Expense record saved successfully to database. ID: {}", expense.getId());

            ExpenseResponse response = new ExpenseResponse(
                    expense.getId(),
                    expense.getTitle(),
                    expense.getAmount(),
                    expense.getCategory(),
                    expense.getDate(),
                    expense.getDescription(),
                    expense.getReceiptUrl()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Expense created successfully", response));
        } catch (Exception e) {
            log.error("Failed to save expense record. Error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @RequestMapping(value = "/{id}", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id,
            @RequestBody ExpenseRequest request) {
        try {
            User user = userService.getUserByToken(token);
            Expense expense = expenseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Expense entry not found"));

            if (!expense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "You do not have permission to modify this entry", null));
            }

            if (request.getTitle() != null) expense.setTitle(request.getTitle());
            if (request.getAmount() != null) expense.setAmount(request.getAmount());
            if (request.getCategory() != null) expense.setCategory(request.getCategory());
            if (request.getDate() != null) expense.setDate(request.getDate());
            if (request.getDescription() != null) expense.setDescription(request.getDescription());
            if (request.getReceiptUrl() != null) expense.setReceiptUrl(request.getReceiptUrl());

            expense = expenseRepository.save(expense);

            ExpenseResponse response = new ExpenseResponse(
                    expense.getId(),
                    expense.getTitle(),
                    expense.getAmount(),
                    expense.getCategory(),
                    expense.getDate(),
                    expense.getDescription(),
                    expense.getReceiptUrl()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, "Expense updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id) {
        try {
            User user = userService.getUserByToken(token);
            Expense expense = expenseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Expense entry not found"));

            if (!expense.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "You do not have permission to delete this entry", null));
            }

            expenseRepository.delete(expense);
            return ResponseEntity.ok(new ApiResponse<>(true, "Expense deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
