package com.feedback.feedback_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.feedback.feedback_backend.model.Faculty;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {
    Optional<Faculty> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Faculty> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name, String email);
}