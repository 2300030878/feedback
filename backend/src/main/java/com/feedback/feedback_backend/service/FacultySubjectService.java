package com.feedback.feedback_backend.service;

import com.feedback.feedback_backend.model.Faculty;
import com.feedback.feedback_backend.model.FacultySubject;
import com.feedback.feedback_backend.model.Subject;
import com.feedback.feedback_backend.repository.FacultyRepository;
import com.feedback.feedback_backend.repository.FacultySubjectRepository;
import com.feedback.feedback_backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FacultySubjectService {
    
    private final FacultySubjectRepository facultySubjectRepository;
    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;
    
    public FacultySubject assignFacultyToSubject(Long facultyId, Long subjectId) {
        if (facultySubjectRepository.existsByFacultyFacultyIdAndSubjectSubjectId(facultyId, subjectId)) {
            throw new RuntimeException("Faculty is already assigned to this subject");
        }
        
        Faculty faculty = facultyRepository.findById(facultyId)
            .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        Subject subject = subjectRepository.findById(subjectId)
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        FacultySubject facultySubject = new FacultySubject(faculty, subject);
        return facultySubjectRepository.save(facultySubject);
    }
    
    public List<FacultySubject> getAllMappings() {
        return facultySubjectRepository.findAll();
    }
    
    public List<FacultySubject> getMappingsByFaculty(Long facultyId) {
        return facultySubjectRepository.findByFacultyFacultyId(facultyId);
    }
    
    public List<FacultySubject> getMappingsBySubject(Long subjectId) {
        return facultySubjectRepository.findBySubjectSubjectId(subjectId);
    }
    
    public void removeFacultyFromSubject(Long facultyId, Long subjectId) {
        FacultySubject mapping = facultySubjectRepository.findByFacultyFacultyIdAndSubjectSubjectId(facultyId, subjectId)
            .orElseThrow(() -> new RuntimeException("Mapping not found"));
        facultySubjectRepository.delete(mapping);
    }
}