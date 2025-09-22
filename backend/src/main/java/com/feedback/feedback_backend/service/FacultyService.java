package com.feedback.feedback_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.feedback.feedback_backend.model.Faculty;
import com.feedback.feedback_backend.repository.FacultyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultyService {
    
    private final FacultyRepository facultyRepository;
    
    public Faculty createFaculty(Faculty faculty) {
        if (facultyRepository.existsByEmail(faculty.getEmail())) {
            throw new RuntimeException("Faculty email already exists");
        }
        return facultyRepository.save(faculty);
    }
    
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public List<Faculty> search(String q) {
        return facultyRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(q, q);
    }
    
    public Optional<Faculty> getFacultyById(Long id) {
        return facultyRepository.findById(id);
    }
    
    public Faculty updateFaculty(Long id, Faculty facultyDetails) {
        return facultyRepository.findById(id)
            .map(faculty -> {
                faculty.setName(facultyDetails.getName());
                faculty.setEmail(facultyDetails.getEmail());
                faculty.setDepartment(facultyDetails.getDepartment());
                return facultyRepository.save(faculty);
            })
            .orElseThrow(() -> new RuntimeException("Faculty not found"));
    }
    
    public void deleteFaculty(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new RuntimeException("Faculty not found");
        }
        facultyRepository.deleteById(id);
    }
}