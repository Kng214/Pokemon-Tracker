package com.pokemonprofit.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ApiController {

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from Spring Boot 👋";
    }
}