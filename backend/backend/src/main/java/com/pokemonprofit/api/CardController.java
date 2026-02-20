package com.pokemonprofit.api;

import com.pokemonprofit.backend.domain.Card;
import com.pokemonprofit.backend.repo.CardRepo;
import com.pokemonprofit.backend.security.CurrentUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardRepo cardRepo;
    private final CurrentUser currentUser;

    public CardController(CardRepo cardRepo, CurrentUser currentUser) {
        this.cardRepo = cardRepo;
        this.currentUser = currentUser;
    }


    @GetMapping
    public List<Card> list() {
        return cardRepo.findByUserId(currentUser.get().getId());
    }

    @PostMapping
    public Card create(@RequestBody Card card) {
        card.setId(null);
        card.setUser(currentUser.get()); 
        return cardRepo.save(card);
    }

    @PutMapping("/{id}")
    public Card update(@PathVariable Long id, @RequestBody Card updates) {
        Long userId = currentUser.get().getId();

        Card card = cardRepo.findByIdAndUserId(id, userId).orElseThrow();

        card.setName(updates.getName());
        card.setSetName(updates.getSetName());
        card.setCardNumber(updates.getCardNumber());

        return cardRepo.save(card);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Long userId = currentUser.get().getId();

        Card card = cardRepo.findByIdAndUserId(id, userId).orElseThrow();

        cardRepo.delete(card);
    }
}
