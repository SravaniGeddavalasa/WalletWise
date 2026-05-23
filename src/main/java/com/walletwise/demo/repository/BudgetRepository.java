package com.walletwise.demo.repository;

import com.walletwise.demo.entity.Budget;
import com.walletwise.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, UUID> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByUserAndCategoryIgnoreCase(User user, String category);
}
