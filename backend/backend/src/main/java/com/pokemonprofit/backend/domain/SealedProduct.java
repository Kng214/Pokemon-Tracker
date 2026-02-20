package com.pokemonprofit.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor
public class SealedProduct {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;
    @ManyToOne
    private CatalogItem catalogItem;

    private String name;
    private String setName;
    private Integer quantity;
}