package com.feedback.feedback_backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.feedback.feedback_backend.model.Subject;
import com.feedback.feedback_backend.repository.SubjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SubjectService {
    
    private final SubjectRepository subjectRepository;
    
    public Subject createSubject(Subject subject) {
        if (subjectRepository.existsBySubjectCode(subject.getSubjectCode())) {
            throw new RuntimeException("Subject code already exists");
        }
        return subjectRepository.save(subject);
    }
    
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public List<Subject> search(String q) {
        return subjectRepository.findBySubjectNameContainingIgnoreCaseOrSubjectCodeContainingIgnoreCase(q, q);
    }
    
    public Optional<Subject> getSubjectById(Long id) {
        return subjectRepository.findById(id);
    }
    
    public Subject updateSubject(Long id, Subject subjectDetails) {
        return subjectRepository.findById(id)
            .map(subject -> {
                subject.setSubjectCode(subjectDetails.getSubjectCode());
                subject.setSubjectName(subjectDetails.getSubjectName());
                return subjectRepository.save(subject);
            })
            .orElseThrow(() -> new RuntimeException("Subject not found"));
    }
    
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new RuntimeException("Subject not found");
        }
        subjectRepository.deleteById(id);
    }
}