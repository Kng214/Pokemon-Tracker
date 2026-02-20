package com.pokemonprofit.backend.repo;

import com.pokemonprofit.backend.domain.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SaleRepo extends JpaRepository<Sale, Long> {
  List<Sale> findByUserId(Long userId);
  Optional<Sale> findByIdAndUserId(Long id, Long userId);

  @Query("select coalesce(sum(s.quantity), 0) from Sale s where s.user.id = :userId and s.card.id = :cardId")
  int sumQtyByUserAndCard(Long userId, Long cardId);

  @Query("select coalesce(sum(s.quantity), 0) from Sale s where s.user.id = :userId and s.sealedProduct.id = :sealedId")
  int sumQtyByUserAndSealed(Long userId, Long sealedId);
}