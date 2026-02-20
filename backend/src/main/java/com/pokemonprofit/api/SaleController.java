package com.pokemonprofit.api;

import com.pokemonprofit.api.dto.SaleRequest;
import com.pokemonprofit.backend.domain.Sale;
import com.pokemonprofit.backend.repo.*;
import com.pokemonprofit.backend.security.CurrentUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

  private final SaleRepo saleRepo;
  private final PurchaseRepo purchaseRepo;
  private final CardRepo cardRepo;
  private final SealedRepo sealedRepo;
  private final CurrentUser currentUser;

  public SaleController(
      SaleRepo saleRepo,
      PurchaseRepo purchaseRepo,
      CardRepo cardRepo,
      SealedRepo sealedRepo,
      CurrentUser currentUser
  ) {
    this.saleRepo = saleRepo;
    this.purchaseRepo = purchaseRepo;
    this.cardRepo = cardRepo;
    this.sealedRepo = sealedRepo;
    this.currentUser = currentUser;
  }

  @GetMapping
  public List<Sale> list() {
    return saleRepo.findByUserId(currentUser.get().getId());
  }

  @PostMapping
  public Sale create(@RequestBody SaleRequest req) {
    var user = currentUser.get();

    validateXor(req.cardId(), req.sealedProductId());

    int qty = normalizeQty(req.quantity());

    ensureEnoughInventory(user.getId(), req.cardId(), req.sealedProductId(), qty, null);

    Sale s = new Sale();
    s.setUser(user);
    s.setDate(req.date());
    s.setQuantity(qty);
    s.setPrice(req.price());
    s.setPlatform(req.platform());

    if (req.cardId() != null) {
      var card = cardRepo.findByIdAndUserId(req.cardId(), user.getId()).orElseThrow();
      s.setCard(card);
      s.setSealedProduct(null);
    } else {
      var sealed = sealedRepo.findByIdAndUserId(req.sealedProductId(), user.getId()).orElseThrow();
      s.setSealedProduct(sealed);
      s.setCard(null);
    }

    return saleRepo.save(s);
  }

  @PutMapping("/{id}")
  public Sale update(@PathVariable Long id, @RequestBody SaleRequest req) {
    var user = currentUser.get();

    validateXor(req.cardId(), req.sealedProductId());

    Sale s = saleRepo.findByIdAndUserId(id, user.getId()).orElseThrow();

    int qty = normalizeQty(req.quantity());

    ensureEnoughInventory(user.getId(), req.cardId(), req.sealedProductId(), qty, s);

    s.setDate(req.date());
    s.setQuantity(qty);
    s.setPrice(req.price());
    s.setPlatform(req.platform());

    if (req.cardId() != null) {
      var card = cardRepo.findByIdAndUserId(req.cardId(), user.getId()).orElseThrow();
      s.setCard(card);
      s.setSealedProduct(null);
    } else {
      var sealed = sealedRepo.findByIdAndUserId(req.sealedProductId(), user.getId()).orElseThrow();
      s.setSealedProduct(sealed);
      s.setCard(null);
    }

    return saleRepo.save(s);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    var userId = currentUser.get().getId();
    var s = saleRepo.findByIdAndUserId(id, userId).orElseThrow();
    saleRepo.delete(s);
  }


  private static int normalizeQty(Integer q) {
    if (q == null) return 1;
    if (q < 1) throw new IllegalArgumentException("Quantity must be at least 1.");
    return q;
  }

  private static void validateXor(Long cardId, Long sealedId) {
    boolean cardSet = cardId != null;
    boolean sealedSet = sealedId != null;
    if (cardSet == sealedSet) {
      throw new IllegalArgumentException("Select either cardId OR sealedProductId (not both, not neither).");
    }
  }

  private void ensureEnoughInventory(Long userId, Long cardId, Long sealedId, int newQty, Sale existingSaleOrNull) {
    int purchased;
    int sold;

    if (cardId != null) {
      purchased = purchaseRepo.sumQtyByUserAndCard(userId, cardId);
      sold = saleRepo.sumQtyByUserAndCard(userId, cardId);
      if (existingSaleOrNull != null && existingSaleOrNull.getCard() != null) {
        sold -= normalizeQty(existingSaleOrNull.getQuantity());
      }
    } else {
      purchased = purchaseRepo.sumQtyByUserAndSealed(userId, sealedId);
      sold = saleRepo.sumQtyByUserAndSealed(userId, sealedId);
      if (existingSaleOrNull != null && existingSaleOrNull.getSealedProduct() != null) {
        sold -= normalizeQty(existingSaleOrNull.getQuantity());
      }
    }

    int onHand = purchased - sold;
    if (newQty > onHand) {
      throw new IllegalArgumentException("Not enough inventory. On hand: " + onHand + ", tried to sell: " + newQty);
    }
  }
}