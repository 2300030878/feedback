package com.feedback.feedback_backend.controller;

import com.feedback.feedback_backend.dto.FeedbackRequest;
import com.feedback.feedback_backend.dto.FeedbackResponse;
import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FeedbackController {
    
    private final FeedbackService feedbackService;
    
    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        try {
            // Get current user from security context
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            
            FeedbackResponse response = feedbackService.submitFeedback(currentUser.getUserId(), request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> getAllFeedback() {
        List<FeedbackResponse> feedbacks = feedbackService.getAllFeedback();
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FeedbackResponse> getFeedbackById(@PathVariable Long id) {
        Optional<FeedbackResponse> feedback = feedbackService.getFeedbackById(id);
        return feedback.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByStudent(@PathVariable Long studentId) {
        List<FeedbackResponse> feedbacks = feedbackService.getFeedbackByStudent(studentId);
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackByFaculty(@PathVariable Long facultyId) {
        List<FeedbackResponse> feedbacks = feedbackService.getFeedbackByFaculty(facultyId);
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackBySubject(@PathVariable Long subjectId) {
        List<FeedbackResponse> feedbacks = feedbackService.getFeedbackBySubject(subjectId);
        return ResponseEntity.ok(feedbacks);
    }
}