package com.feedback.feedback_backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.feedback.feedback_backend.model.FeedbackEvent;

@Repository
public interface FeedbackEventRepository extends JpaRepository<FeedbackEvent, Long> {
    List<FeedbackEvent> findBySubjectSubjectId(Long subjectId);
    List<FeedbackEvent> findByStartAtBeforeAndEndAtAfter(LocalDateTime now1, LocalDateTime now2);
    List<FeedbackEvent> findByEndAtBefore(LocalDateTime time);
    List<FeedbackEvent> findByStartAtAfter(LocalDateTime time);
}

