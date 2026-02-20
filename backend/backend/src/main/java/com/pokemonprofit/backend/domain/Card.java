package com.pokemonprofit.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor
public class Card {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    private User user;

    private String name;
    private String setName;
    private String cardNumber;
    private String printing;
    private String condition;
}
