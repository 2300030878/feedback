package com.feedback.feedback_backend.controller;

import com.feedback.feedback_backend.dto.AnalyticsResponse;
import com.feedback.feedback_backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {
    
    private final AnalyticsService analyticsService;
    
    @GetMapping("/subjects/{subjectId}")
    public ResponseEntity<AnalyticsResponse> getSubjectAnalytics(@PathVariable Long subjectId) {
        try {
            AnalyticsResponse response = analyticsService.getSubjectAnalytics(subjectId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<AnalyticsResponse> getFacultyAnalytics(@PathVariable Long facultyId) {
        try {
            AnalyticsResponse response = analyticsService.getFacultyAnalytics(facultyId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/overall")
    public ResponseEntity<AnalyticsResponse> getOverallAnalytics() {
        try {
            AnalyticsResponse response = analyticsService.getOverallAnalytics();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}