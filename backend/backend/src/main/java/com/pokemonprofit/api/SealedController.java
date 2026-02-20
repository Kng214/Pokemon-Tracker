package com.pokemonprofit.api;

import com.pokemonprofit.backend.domain.SealedProduct;
import com.pokemonprofit.backend.repo.SealedRepo;
import com.pokemonprofit.backend.security.CurrentUser;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sealed")
public class SealedController {

  private final SealedRepo sealedRepo;
  private final CurrentUser currentUser;

  public SealedController(SealedRepo sealedRepo, CurrentUser currentUser) {
    this.sealedRepo = sealedRepo;
    this.currentUser = currentUser;
  }

  @GetMapping
  public List<SealedProduct> list() {
    return sealedRepo.findByUserId(currentUser.get().getId());
  }

  @PostMapping
  public SealedProduct create(@RequestBody SealedProduct sealed) {
    sealed.setId(null);
    sealed.setUser(currentUser.get());
    return sealedRepo.save(sealed);
  }

  @PutMapping("/{id}")
  public SealedProduct update(@PathVariable Long id, @RequestBody SealedProduct updates) {
    var userId = currentUser.get().getId();
    var sp = sealedRepo.findByIdAndUserId(id, userId).orElseThrow();

    sp.setName(updates.getName());
    sp.setSetName(updates.getSetName());
    sp.setQuantity(updates.getQuantity());
    sp.setCatalogItem(updates.getCatalogItem());

    return sealedRepo.save(sp);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    var userId = currentUser.get().getId();
    var sp = sealedRepo.findByIdAndUserId(id, userId).orElseThrow();
    sealedRepo.delete(sp);
  }
}
