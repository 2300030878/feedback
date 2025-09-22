package com.feedback.feedback_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {
    
    private Double averageRating;
    private Long totalResponses;
    private List<FeedbackResponse> feedbacks;
    
    public AnalyticsResponse(Double averageRating, Long totalResponses) {
        this.averageRating = averageRating;
        this.totalResponses = totalResponses;
    }
}