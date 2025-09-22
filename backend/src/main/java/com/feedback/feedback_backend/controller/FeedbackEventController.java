package com.feedback.feedback_backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.feedback.feedback_backend.model.FeedbackEvent;
import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.service.FeedbackEventService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"}, maxAge = 3600)
public class FeedbackEventController {
    private final FeedbackEventService eventService;

    @PostMapping
    public ResponseEntity<FeedbackEvent> create(@RequestBody Map<String, String> in) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User admin = (User) auth.getPrincipal();
        String title = in.get("title");
        Long subjectId = Long.valueOf(in.get("subjectId"));
        String description = in.get("description");
        LocalDateTime startAt = LocalDateTime.parse(in.get("startAt"));
        LocalDateTime endAt = LocalDateTime.parse(in.get("endAt"));
        return ResponseEntity.ok(eventService.create(title, subjectId, description, startAt, endAt, admin.getUserId()));
    }

    @GetMapping("/active")
    public ResponseEntity<List<FeedbackEvent>> active() {
        return ResponseEntity.ok(eventService.listActive());
    }

    @GetMapping("/past")
    public ResponseEntity<List<FeedbackEvent>> past() {
        return ResponseEntity.ok(eventService.listPast());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<FeedbackEvent>> upcoming() {
        return ResponseEntity.ok(eventService.listUpcoming());
    }

    @GetMapping
    public ResponseEntity<List<FeedbackEvent>> all() {
        return ResponseEntity.ok(eventService.listAll());
    }

    @GetMapping("/student/me")
    public ResponseEntity<Map<String, List<FeedbackEvent>>> forStudent() {
        // For now, return global segmentation; if student-specific mapping is needed later, filter here
        var now = java.time.LocalDateTime.now();
        var all = eventService.listAll();
        var upcoming = new java.util.ArrayList<FeedbackEvent>();
        var active = new java.util.ArrayList<FeedbackEvent>();
        var past = new java.util.ArrayList<FeedbackEvent>();
        for (var e : all) {
            if (now.isBefore(e.getStartAt())) upcoming.add(e);
            else if (now.isAfter(e.getEndAt())) past.add(e);
            else active.add(e);
        }
        return ResponseEntity.ok(java.util.Map.of(
            "upcoming", upcoming,
            "active", active,
            "past", past
        ));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<FeedbackEvent>> bySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(eventService.listBySubject(subjectId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeedbackEvent> update(@PathVariable Long id, @RequestBody Map<String, String> in) {
        LocalDateTime startAt = in.get("startAt") != null ? LocalDateTime.parse(in.get("startAt")) : null;
        LocalDateTime endAt = in.get("endAt") != null ? LocalDateTime.parse(in.get("endAt")) : null;
        return ResponseEntity.ok(eventService.update(id, in.get("title"), in.get("description"), startAt, endAt));
    }
}

