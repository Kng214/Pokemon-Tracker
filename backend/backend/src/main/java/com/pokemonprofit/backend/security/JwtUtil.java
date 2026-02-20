package com.pokemonprofit.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secret;
    private final long expirationMs;
    private Key key;

    public JwtUtil(String secret, long expirationMs) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
            .setSubject(username)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
        Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token);
        return true;
        } catch (JwtException | IllegalArgumentException e) {
        return false;
        }
    }
}
