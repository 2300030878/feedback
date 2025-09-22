package com.feedback.feedback_backend.dto;

import java.time.LocalDateTime;

import com.feedback.feedback_backend.model.Feedback;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    
    private Long feedbackId;
    private Long studentId;
    private String studentName;
    private Long facultyId;
    private String facultyName;
    private Long subjectId;
    private String subjectName;
    private Integer rating;
    private String comments;
    private LocalDateTime createdAt;
    
    public FeedbackResponse(Feedback feedback) {
        this.feedbackId = feedback.getFeedbackId();
        this.studentId = feedback.getStudent().getUserId();
        this.studentName = feedback.getStudent().getName();
        this.facultyId = feedback.getFaculty().getFacultyId();
        this.facultyName = feedback.getFaculty().getName();
        this.subjectId = feedback.getSubject().getSubjectId();
        this.subjectName = feedback.getSubject().getSubjectName();
        this.rating = feedback.getRating();
        this.comments = feedback.getComments();
        this.createdAt = feedback.getCreatedAt();
    }
}