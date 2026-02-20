package com.pokemonprofit.backend.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.pokemonprofit.backend.repo.UserRepo;

@Component
public class CurrentUser {
    private final UserRepo userRepo;

    public CurrentUser(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public com.pokemonprofit.backend.domain.User get() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepo.findByUsername(username).orElseThrow();
    }
}
