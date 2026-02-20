package com.pokemonprofit.backend.repo;

import com.pokemonprofit.backend.domain.Card;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CardRepo extends JpaRepository<Card, Long> {
    List<Card> findByUserId(Long userId);
    Optional<Card> findByIdAndUserId(Long id, Long userId);
}
