package com.pokemonprofit.api;

import com.pokemonprofit.api.auth.AuthRequest;
import com.pokemonprofit.backend.domain.User;
import com.pokemonprofit.backend.repo.UserRepo;
import com.pokemonprofit.backend.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final UserRepo userRepo;
  private final PasswordEncoder encoder;
  private final AuthenticationManager authManager;
  private final JwtUtil jwtUtil;

  public AuthController(UserRepo userRepo, PasswordEncoder encoder, AuthenticationManager authManager, JwtUtil jwtUtil) {
    this.userRepo = userRepo;
    this.encoder = encoder;
    this.authManager = authManager;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/signup")
  public ResponseEntity<Map<String, String>> signup(@RequestBody AuthRequest req) {
    if (userRepo.findByUsername(req.username()).isPresent()) {
      return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
    }

    User u = new User();
    u.setUsername(req.username());
    u.setPasswordHash(encoder.encode(req.password()));
    userRepo.save(u);

    String token = jwtUtil.generateToken(u.getUsername());
    return ResponseEntity.ok(Map.of("token", token));
  }

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest req) {
    authManager.authenticate(
        new UsernamePasswordAuthenticationToken(req.username(), req.password())
    );

    String token = jwtUtil.generateToken(req.username());
    return ResponseEntity.ok(Map.of("token", token)); 
  }
}
