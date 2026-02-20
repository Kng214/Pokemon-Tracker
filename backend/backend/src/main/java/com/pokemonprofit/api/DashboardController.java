package com.pokemonprofit.api;

import com.pokemonprofit.api.dto.DashboardResponse;
import com.pokemonprofit.backend.repo.*;
import com.pokemonprofit.backend.security.CurrentUser;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final CurrentUser currentUser;
  private final CardRepo cardRepo;
  private final SealedRepo sealedRepo;
  private final PurchaseRepo purchaseRepo;
  private final SaleRepo saleRepo;

  public DashboardController(CurrentUser currentUser, CardRepo cardRepo, SealedRepo sealedRepo, PurchaseRepo purchaseRepo, SaleRepo saleRepo) {
    this.currentUser = currentUser;
    this.cardRepo = cardRepo;
    this.sealedRepo = sealedRepo;
    this.purchaseRepo = purchaseRepo;
    this.saleRepo = saleRepo;
  }

  @GetMapping
  public DashboardResponse get() {
    var userId = currentUser.get().getId();

    long cards = cardRepo.findByUserId(userId).size();
    long sealed = sealedRepo.findByUserId(userId).size();
    long purchases = purchaseRepo.findByUserId(userId).size();
    long sales = saleRepo.findByUserId(userId).size();

    BigDecimal totalSales = saleRepo.findByUserId(userId).stream()
      .map(s -> s.getPrice() == null ? BigDecimal.ZERO : s.getPrice())
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal totalSpent = purchaseRepo.findByUserId(userId).stream()
      .map(p -> {
        var qty = p.getQuantity() == null ? 0 : p.getQuantity();
        var priceEach = p.getPriceEach() == null ? BigDecimal.ZERO : p.getPriceEach();
        return priceEach.multiply(BigDecimal.valueOf(qty));
      })
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal profit = totalSales.subtract(totalSpent);

    return new DashboardResponse(cards, sealed, purchases, sales, totalSpent, totalSales, profit);
  }
}
