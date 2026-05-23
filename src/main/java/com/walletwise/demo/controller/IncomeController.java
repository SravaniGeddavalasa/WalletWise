package com.walletwise.demo.controller;

import com.walletwise.demo.dto.ApiResponse;
import com.walletwise.demo.dto.IncomeRequest;
import com.walletwise.demo.dto.IncomeResponse;
import com.walletwise.demo.entity.Income;
import com.walletwise.demo.entity.User;
import com.walletwise.demo.repository.IncomeRepository;
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
@RequestMapping("/api/income")
public class IncomeController {

    private static final Logger log = LoggerFactory.getLogger(IncomeController.class);

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<IncomeResponse>>> getIncomes(
            @RequestHeader("Authorization") String token) {
        try {
            User user = userService.getUserByToken(token);
            List<Income> incomes = incomeRepository.findByUserOrderByDateDesc(user);
            List<IncomeResponse> responses = incomes.stream()
                    .map(i -> new IncomeResponse(i.getId(), i.getTitle(), i.getAmount(), i.getCategory(), i.getDate(), i.getDescription()))
                    .collect(Collectors.toList());
            return ResponseEntity.ok(new ApiResponse<>(true, "Incomes fetched successfully", responses));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<IncomeResponse>> createIncome(
            @RequestHeader("Authorization") String token,
            @RequestBody IncomeRequest request) {
        log.info("Received request to create income with title: {}", request.getTitle());
        try {
            User user = userService.getUserByToken(token);
            Income income = new Income();
            income.setTitle(request.getTitle());
            income.setAmount(request.getAmount());
            income.setCategory(request.getCategory());
            income.setDate(request.getDate());
            income.setDescription(request.getDescription());
            income.setUser(user);

            income = incomeRepository.save(income);
            log.info("Income record saved successfully to database. ID: {}", income.getId());

            IncomeResponse response = new IncomeResponse(
                    income.getId(),
                    income.getTitle(),
                    income.getAmount(),
                    income.getCategory(),
                    income.getDate(),
                    income.getDescription()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Income created successfully", response));
        } catch (Exception e) {
            log.error("Failed to save income record. Error: {}", e.getMessage(), e);
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @RequestMapping(value = "/{id}", method = {RequestMethod.PATCH, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<IncomeResponse>> updateIncome(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id,
            @RequestBody IncomeRequest request) {
        try {
            User user = userService.getUserByToken(token);
            Income income = incomeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Income entry not found"));

            if (!income.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "You do not have permission to modify this entry", null));
            }

            if (request.getTitle() != null) income.setTitle(request.getTitle());
            if (request.getAmount() != null) income.setAmount(request.getAmount());
            if (request.getCategory() != null) income.setCategory(request.getCategory());
            if (request.getDate() != null) income.setDate(request.getDate());
            if (request.getDescription() != null) income.setDescription(request.getDescription());

            income = incomeRepository.save(income);

            IncomeResponse response = new IncomeResponse(
                    income.getId(),
                    income.getTitle(),
                    income.getAmount(),
                    income.getCategory(),
                    income.getDate(),
                    income.getDescription()
            );

            return ResponseEntity.ok(new ApiResponse<>(true, "Income updated successfully", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteIncome(
            @RequestHeader("Authorization") String token,
            @PathVariable UUID id) {
        try {
            User user = userService.getUserByToken(token);
            Income income = incomeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Income entry not found"));

            if (!income.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "You do not have permission to delete this entry", null));
            }

            incomeRepository.delete(income);
            return ResponseEntity.ok(new ApiResponse<>(true, "Income deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
        }
    }
}
