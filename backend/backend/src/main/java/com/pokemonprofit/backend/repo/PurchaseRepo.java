package com.pokemonprofit.backend.repo;

import com.pokemonprofit.backend.domain.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PurchaseRepo extends JpaRepository<Purchase, Long> {
  List<Purchase> findByUserId(Long userId);
  Optional<Purchase> findByIdAndUserId(Long id, Long userId);

  @Query("select coalesce(sum(p.quantity), 0) from Purchase p where p.user.id = :userId and p.card.id = :cardId")
  int sumQtyByUserAndCard(Long userId, Long cardId);

  @Query("select coalesce(sum(p.quantity), 0) from Purchase p where p.user.id = :userId and p.sealedProduct.id = :sealedId")
  int sumQtyByUserAndSealed(Long userId, Long sealedId);
}