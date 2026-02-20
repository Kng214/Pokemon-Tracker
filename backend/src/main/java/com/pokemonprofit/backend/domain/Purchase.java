package com.pokemonprofit.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor
public class Purchase {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    private User user;

    private LocalDate date;

    @ManyToOne
    private Card card; 

    @ManyToOne
    private SealedProduct sealedProduct; 

    private Integer quantity;

    @Column(precision=12, scale=2)
    private BigDecimal priceEach;
}
