package com.feedback.feedback_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.feedback.feedback_backend.model.FeedbackEvent;
import com.feedback.feedback_backend.model.Subject;
import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.repository.FeedbackEventRepository;
import com.feedback.feedback_backend.repository.SubjectRepository;
import com.feedback.feedback_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FeedbackEventService {
    private final FeedbackEventRepository eventRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public FeedbackEvent create(String title, Long subjectId, String description, LocalDateTime startAt, LocalDateTime endAt, Long adminId) {
        Subject subject = subjectRepository.findById(subjectId).orElseThrow(() -> new RuntimeException("Subject not found"));
        User admin = userRepository.findById(adminId).orElseThrow(() -> new RuntimeException("Admin not found"));
        FeedbackEvent e = new FeedbackEvent();
        e.setTitle(title);
        e.setSubject(subject);
        e.setDescription(description);
        e.setStartAt(startAt);
        e.setEndAt(endAt);
        e.setCreatedBy(admin);
        return eventRepository.save(e);
    }

    public List<FeedbackEvent> listActive() {
        LocalDateTime now = LocalDateTime.now();
        return eventRepository.findByStartAtBeforeAndEndAtAfter(now, now);
    }

    public List<FeedbackEvent> listBySubject(Long subjectId) {
        return eventRepository.findBySubjectSubjectId(subjectId);
    }

    public List<FeedbackEvent> listPast() {
        return eventRepository.findByEndAtBefore(LocalDateTime.now());
    }

    public List<FeedbackEvent> listAll() {
        return eventRepository.findAll();
    }

    public Optional<FeedbackEvent> findById(Long id) {
        return eventRepository.findById(id);
    }

    public FeedbackEvent update(Long id, String title, String description, LocalDateTime startAt, LocalDateTime endAt) {
        FeedbackEvent e = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        if (title != null) e.setTitle(title);
        if (description != null) e.setDescription(description);
        if (startAt != null) e.setStartAt(startAt);
        if (endAt != null) e.setEndAt(endAt);
        return eventRepository.save(e);
    }
}

