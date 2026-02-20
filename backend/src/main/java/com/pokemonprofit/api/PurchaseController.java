package com.pokemonprofit.api;

import com.pokemonprofit.api.dto.PurchaseRequest;
import com.pokemonprofit.backend.domain.Purchase;
import com.pokemonprofit.backend.repo.*;
import com.pokemonprofit.backend.security.CurrentUser;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

  private final PurchaseRepo purchaseRepo;
  private final CardRepo cardRepo;
  private final SealedRepo sealedRepo;
  private final CurrentUser currentUser;

  public PurchaseController(PurchaseRepo purchaseRepo, CardRepo cardRepo, SealedRepo sealedRepo, CurrentUser currentUser) {
    this.purchaseRepo = purchaseRepo;
    this.cardRepo = cardRepo;
    this.sealedRepo = sealedRepo;
    this.currentUser = currentUser;
  }

  @GetMapping
  public List<Purchase> list() {
    return purchaseRepo.findByUserId(currentUser.get().getId());
  }

  @PostMapping
  public Purchase create(@RequestBody PurchaseRequest req) {
    var user = currentUser.get();
    validateXor(req.cardId(), req.sealedProductId());

    var p = new Purchase();
    p.setUser(user);
    p.setDate(req.date());
    p.setQuantity(req.quantity());
    p.setPriceEach(req.priceEach());

    if (req.cardId() != null) {
      var card = cardRepo.findByIdAndUserId(req.cardId(), user.getId()).orElseThrow();
      p.setCard(card);
      p.setSealedProduct(null);
    } else {
      var sealed = sealedRepo.findByIdAndUserId(req.sealedProductId(), user.getId()).orElseThrow();
      p.setSealedProduct(sealed);
      p.setCard(null);
    }

    return purchaseRepo.save(p);
  }

  @PutMapping("/{id}")
  public Purchase update(@PathVariable Long id, @RequestBody PurchaseRequest req) {
    var user = currentUser.get();
    validateXor(req.cardId(), req.sealedProductId());

    var p = purchaseRepo.findByIdAndUserId(id, user.getId()).orElseThrow();

    p.setDate(req.date());
    p.setQuantity(req.quantity());
    p.setPriceEach(req.priceEach());

    if (req.cardId() != null) {
      var card = cardRepo.findByIdAndUserId(req.cardId(), user.getId()).orElseThrow();
      p.setCard(card);
      p.setSealedProduct(null);
    } else {
      var sealed = sealedRepo.findByIdAndUserId(req.sealedProductId(), user.getId()).orElseThrow();
      p.setSealedProduct(sealed);
      p.setCard(null);
    }

    return purchaseRepo.save(p);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    var userId = currentUser.get().getId();
    var p = purchaseRepo.findByIdAndUserId(id, userId).orElseThrow();
    purchaseRepo.delete(p);
  }

  private static void validateXor(Long cardId, Long sealedId) {
    boolean cardSet = cardId != null;
    boolean sealedSet = sealedId != null;
    if (cardSet == sealedSet) {
      throw new IllegalArgumentException("Select either cardId OR sealedProductId (not both, not neither).");
    }
  }
}
