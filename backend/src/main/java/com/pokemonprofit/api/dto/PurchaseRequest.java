package com.pokemonprofit.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PurchaseRequest(
  LocalDate date,
  Long cardId,          
  Long sealedProductId, 
  Integer quantity,
  BigDecimal priceEach
) {}
