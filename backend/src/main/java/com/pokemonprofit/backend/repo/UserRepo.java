package com.pokemonprofit.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pokemonprofit.backend.domain.User;

import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);
}