package com.pokemonprofit.api.dto;

import java.math.BigDecimal;

public record DashboardResponse(
  long cardsCount,
  long sealedCount,
  long purchasesCount,
  long salesCount,
  BigDecimal totalSpent,
  BigDecimal totalSales,
  BigDecimal realizedProfit
) {}
