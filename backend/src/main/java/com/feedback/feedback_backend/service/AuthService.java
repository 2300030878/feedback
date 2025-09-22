package com.feedback.feedback_backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.feedback.feedback_backend.dto.AuthRequest;
import com.feedback.feedback_backend.dto.AuthResponse;
import com.feedback.feedback_backend.dto.UserRegistrationRequest;
import com.feedback.feedback_backend.model.Faculty;
import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.repository.FacultyRepository;
import com.feedback.feedback_backend.repository.UserRepository;
import com.feedback.feedback_backend.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final FacultyRepository facultyRepository;
    
    public AuthResponse register(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        
        User savedUser = userRepository.save(user);

        // If registering as FACULTY, ensure a Faculty record exists (idempotent by email)
        if (savedUser.getRole() == User.Role.FACULTY) {
            facultyRepository.findByEmail(savedUser.getEmail())
                .orElseGet(() -> {
                    Faculty f = new Faculty();
                    f.setName(savedUser.getName());
                    f.setEmail(savedUser.getEmail());
                    f.setDepartment("General");
                    return facultyRepository.save(f);
                });
        }
        String token = jwtUtil.generateToken(savedUser);
        
        return new AuthResponse(token, savedUser);
    }
    
    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // On FACULTY login, sync Faculty table by email
        if (user.getRole() == User.Role.FACULTY) {
            facultyRepository.findByEmail(user.getEmail())
                .orElseGet(() -> {
                    Faculty f = new Faculty();
                    f.setName(user.getName());
                    f.setEmail(user.getEmail());
                    f.setDepartment("General");
                    return facultyRepository.save(f);
                });
        }
        
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user);
    }
}