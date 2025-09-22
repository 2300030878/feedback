package com.feedback.feedback_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.feedback.feedback_backend.model.FacultySubject;

@Repository
public interface FacultySubjectRepository extends JpaRepository<FacultySubject, Long> {
    List<FacultySubject> findByFacultyFacultyId(Long facultyId);
    List<FacultySubject> findBySubjectSubjectId(Long subjectId);
    Optional<FacultySubject> findByFacultyFacultyIdAndSubjectSubjectId(Long facultyId, Long subjectId);
    boolean existsByFacultyFacultyIdAndSubjectSubjectId(Long facultyId, Long subjectId);
}