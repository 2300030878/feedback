package com.feedback.feedback_backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.feedback.feedback_backend.model.Feedback;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    @EntityGraph(attributePaths = {"student", "faculty", "subject", "event"})
    @Query("SELECT f FROM Feedback f")
    List<Feedback> findAllWithDetails();
    
    @EntityGraph(attributePaths = {"student", "faculty", "subject", "event"})
    List<Feedback> findByStudentUserId(Long studentId);
    
    @EntityGraph(attributePaths = {"student", "faculty", "subject", "event"})
    List<Feedback> findByFacultyFacultyId(Long facultyId);
    
    @EntityGraph(attributePaths = {"student", "faculty", "subject", "event"})
    List<Feedback> findBySubjectSubjectId(Long subjectId);
    
    @EntityGraph(attributePaths = {"student", "faculty", "subject", "event"})
    List<Feedback> findByEventEventId(Long eventId);
    
    @EntityGraph(attributePaths = {"student", "faculty", "subject", "event"})
    List<Feedback> findByFacultyFacultyIdAndSubjectSubjectId(Long facultyId, Long subjectId);
    
    @Query("SELECT f FROM Feedback f WHERE f.student.userId = :studentId AND f.faculty.facultyId = :facultyId AND f.subject.subjectId = :subjectId")
    Optional<Feedback> findByStudentAndFacultyAndSubject(@Param("studentId") Long studentId, 
                                                         @Param("facultyId") Long facultyId, 
                                                         @Param("subjectId") Long subjectId);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.faculty.facultyId = :facultyId")
    Double getAverageRatingByFacultyId(@Param("facultyId") Long facultyId);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.subject.subjectId = :subjectId")
    Double getAverageRatingBySubjectId(@Param("subjectId") Long subjectId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.faculty.facultyId = :facultyId")
    Long getFeedbackCountByFacultyId(@Param("facultyId") Long facultyId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.subject.subjectId = :subjectId")
    Long getFeedbackCountBySubjectId(@Param("subjectId") Long subjectId);
}