package com.feedback.feedback_backend.service;

import com.feedback.feedback_backend.dto.AnalyticsResponse;
import com.feedback.feedback_backend.dto.FeedbackResponse;
import com.feedback.feedback_backend.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final FeedbackRepository feedbackRepository;
    
    public AnalyticsResponse getSubjectAnalytics(Long subjectId) {
        Double averageRating = feedbackRepository.getAverageRatingBySubjectId(subjectId);
        Long totalResponses = feedbackRepository.getFeedbackCountBySubjectId(subjectId);
        
        List<FeedbackResponse> feedbacks = feedbackRepository.findBySubjectSubjectId(subjectId)
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
        
        return new AnalyticsResponse(averageRating, totalResponses, feedbacks);
    }
    
    public AnalyticsResponse getFacultyAnalytics(Long facultyId) {
        Double averageRating = feedbackRepository.getAverageRatingByFacultyId(facultyId);
        Long totalResponses = feedbackRepository.getFeedbackCountByFacultyId(facultyId);
        
        List<FeedbackResponse> feedbacks = feedbackRepository.findByFacultyFacultyId(facultyId)
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
        
        return new AnalyticsResponse(averageRating, totalResponses, feedbacks);
    }
    
    public AnalyticsResponse getOverallAnalytics() {
        List<FeedbackResponse> allFeedbacks = feedbackRepository.findAll()
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
        
        Double averageRating = allFeedbacks.stream()
            .mapToInt(FeedbackResponse::getRating)
            .average()
            .orElse(0.0);
        
        Long totalResponses = (long) allFeedbacks.size();
        
        return new AnalyticsResponse(averageRating, totalResponses, allFeedbacks);
    }
}