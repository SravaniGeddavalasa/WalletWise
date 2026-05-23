package com.walletwise.demo.repository;

import com.walletwise.demo.entity.Income;
import com.walletwise.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncomeRepository extends JpaRepository<Income, UUID> {
    List<Income> findByUserOrderByDateDesc(User user);
}
