package com.feedback.feedback_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "faculty_subjects")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class FacultySubject {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;
    
    public FacultySubject(Faculty faculty, Subject subject) {
        this.faculty = faculty;
        this.subject = subject;
    }
    
    // Computed properties to avoid lazy loading issues
    public Long getFacultyId() {
        return faculty != null ? faculty.getFacultyId() : null;
    }
    
    public String getFacultyName() {
        return faculty != null ? faculty.getName() : null;
    }
    
    public Long getSubjectId() {
        return subject != null ? subject.getSubjectId() : null;
    }
    
    public String getSubjectName() {
        return subject != null ? subject.getSubjectName() : null;
    }
}