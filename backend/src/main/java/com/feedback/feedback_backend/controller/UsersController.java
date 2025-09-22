package com.feedback.feedback_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UsersController {

    private final UserRepository userRepository;

    @RequestMapping("/role/{role}")
    public ResponseEntity<List<User>> listByRole(@PathVariable String role, String q) {
        try {
            User.Role r = User.Role.valueOf(role);
            if (q == null || q.isBlank()) {
                return ResponseEntity.ok(userRepository.findByRole(r));
            }
            // Simple search by name or email
            List<User> byName = userRepository.findByRoleAndNameContainingIgnoreCase(r, q);
            List<User> byEmail = userRepository.findByRoleAndEmailContainingIgnoreCase(r, q);
            byName.addAll(byEmail.stream().filter(u -> !byName.contains(u)).toList());
            return ResponseEntity.ok(byName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody User in) {
        return userRepository.findById(id)
            .map(u -> {
                if (in.getName() != null) u.setName(in.getName());
                if (in.getEmail() != null) u.setEmail(in.getEmail());
                if (in.getRole() != null) u.setRole(in.getRole());
                userRepository.save(u);
                return ResponseEntity.ok(u);
            })
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

