package com.feedback.feedback_backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.feedback.feedback_backend.dto.FeedbackRequest;
import com.feedback.feedback_backend.dto.FeedbackResponse;
import com.feedback.feedback_backend.model.Faculty;
import com.feedback.feedback_backend.model.Feedback;
import com.feedback.feedback_backend.model.FeedbackEvent;
import com.feedback.feedback_backend.model.Subject;
import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.repository.FacultyRepository;
import com.feedback.feedback_backend.repository.FeedbackEventRepository;
import com.feedback.feedback_backend.repository.FeedbackRepository;
import com.feedback.feedback_backend.repository.SubjectRepository;
import com.feedback.feedback_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackService {
    
    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;
    private final FeedbackEventRepository eventRepository;
    
    public FeedbackResponse submitFeedback(Long studentId, FeedbackRequest request) {
        User student = userRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
        
        Faculty faculty = facultyRepository.findById(request.getFacultyId())
            .orElseThrow(() -> new RuntimeException("Faculty not found"));
        
        Subject subject = subjectRepository.findById(request.getSubjectId())
            .orElseThrow(() -> new RuntimeException("Subject not found"));
        
        // If part of an event, validate window and uniqueness per event
        FeedbackEvent event = null;
        if (request.getEventId() != null) {
            event = eventRepository.findById(request.getEventId()).orElseThrow(() -> new RuntimeException("Event not found"));
            if (!event.isActive()) {
                throw new RuntimeException("Feedback event is not active");
            }
        }

        // Check if student has already submitted feedback for this faculty-subject combination (or event if provided)
        Optional<Feedback> existingFeedback = feedbackRepository.findByStudentAndFacultyAndSubject(
            studentId, request.getFacultyId(), request.getSubjectId());
        
        if (existingFeedback.isPresent()) {
            throw new RuntimeException("Feedback already submitted for this faculty-subject combination");
        }
        
        Feedback feedback = new Feedback();
        feedback.setStudent(student);
        feedback.setFaculty(faculty);
        feedback.setSubject(subject);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());
        
        if (event != null) {
            feedback.setEvent(event);
        }
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return new FeedbackResponse(savedFeedback);
    }
    
    public List<FeedbackResponse> getAllFeedback() {
        return feedbackRepository.findAllWithDetails()
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
    }
    
    public List<FeedbackResponse> getFeedbackByStudent(Long studentId) {
        return feedbackRepository.findByStudentUserId(studentId)
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
    }
    
    public List<FeedbackResponse> getFeedbackByFaculty(Long facultyId) {
        return feedbackRepository.findByFacultyFacultyId(facultyId)
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
    }
    
    public List<FeedbackResponse> getFeedbackBySubject(Long subjectId) {
        return feedbackRepository.findBySubjectSubjectId(subjectId)
            .stream()
            .map(FeedbackResponse::new)
            .collect(Collectors.toList());
    }
    
    public Optional<FeedbackResponse> getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
            .map(FeedbackResponse::new);
    }
}