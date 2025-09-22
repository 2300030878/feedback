package com.feedback.feedback_backend.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Feedback {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Long feedbackId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private FeedbackEvent event;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "rating", nullable = false)
    private Integer rating;
    
    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Computed properties to avoid lazy loading issues
    public Long getStudentId() {
        return student != null ? student.getUserId() : null;
    }
    
    public String getStudentName() {
        return student != null ? student.getName() : null;
    }
    
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
    
    public Long getEventId() {
        return event != null ? event.getEventId() : null;
    }
}