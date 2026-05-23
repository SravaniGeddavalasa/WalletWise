package com.walletwise.demo.repository;

import com.walletwise.demo.entity.Expense;
import com.walletwise.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByUserOrderByDateDesc(User user);
}
