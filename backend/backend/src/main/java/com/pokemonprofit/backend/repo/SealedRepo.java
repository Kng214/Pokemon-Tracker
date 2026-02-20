package com.pokemonprofit.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokemonprofit.backend.domain.SealedProduct;

import java.util.List;
import java.util.Optional;

public interface SealedRepo extends JpaRepository<SealedProduct, Long> {
    List<SealedProduct> findByUserId(Long userId);
    Optional<SealedProduct> findByIdAndUserId(Long id, Long userId);
}
