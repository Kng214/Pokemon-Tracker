package com.pokemonprofit.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SaleRequest(
    LocalDate date,
    Long cardId,          
    Long sealedProductId, 
    Integer quantity,
    BigDecimal price,
    String platform
) {}
