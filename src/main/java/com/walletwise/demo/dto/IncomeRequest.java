package com.walletwise.demo.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IncomeRequest {
    private String title;
    private BigDecimal amount;
    private String category;
    private LocalDate date;
    private String description;
}
