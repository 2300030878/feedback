package com.feedback.feedback_backend.controller;

import com.feedback.feedback_backend.model.FacultySubject;
import com.feedback.feedback_backend.service.FacultySubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty-subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FacultySubjectController {
    
    private final FacultySubjectService facultySubjectService;
    
    @PostMapping
    public ResponseEntity<FacultySubject> assignFacultyToSubject(@RequestBody Map<String, Long> request) {
        try {
            Long facultyId = request.get("facultyId");
            Long subjectId = request.get("subjectId");
            FacultySubject mapping = facultySubjectService.assignFacultyToSubject(facultyId, subjectId);
            return ResponseEntity.ok(mapping);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<FacultySubject>> getAllMappings() {
        List<FacultySubject> mappings = facultySubjectService.getAllMappings();
        return ResponseEntity.ok(mappings);
    }
    
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FacultySubject>> getMappingsByFaculty(@PathVariable Long facultyId) {
        List<FacultySubject> mappings = facultySubjectService.getMappingsByFaculty(facultyId);
        return ResponseEntity.ok(mappings);
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<FacultySubject>> getMappingsBySubject(@PathVariable Long subjectId) {
        List<FacultySubject> mappings = facultySubjectService.getMappingsBySubject(subjectId);
        return ResponseEntity.ok(mappings);
    }
    
    @DeleteMapping
    public ResponseEntity<?> removeFacultyFromSubject(@RequestBody Map<String, Long> request) {
        try {
            Long facultyId = request.get("facultyId");
            Long subjectId = request.get("subjectId");
            facultySubjectService.removeFacultyFromSubject(facultyId, subjectId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}