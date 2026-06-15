package com.flowgate.controller;

import com.flowgate.model.User;
import com.flowgate.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {

        User user = userRepository.findByEmail(request.getEmail());

        // USER NOT FOUND
        if (user == null) {
            return ResponseEntity
                    .status(404)
                    .body("User not found");
        }

        // WRONG PASSWORD
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity
                    .status(401)
                    .body("Wrong password");
        }

        Map<String, Object> response = new HashMap<>();

        response.put("token", "flowgate-token");
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if(existingUser != null) {
            return ResponseEntity
                    .status(409)
                    .body("Email already exists");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }
}