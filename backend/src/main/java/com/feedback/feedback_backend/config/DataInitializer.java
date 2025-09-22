package com.feedback.feedback_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.feedback.feedback_backend.model.Faculty;
import com.feedback.feedback_backend.model.FacultySubject;
import com.feedback.feedback_backend.model.Subject;
import com.feedback.feedback_backend.model.User;
import com.feedback.feedback_backend.repository.FacultyRepository;
import com.feedback.feedback_backend.repository.FacultySubjectRepository;
import com.feedback.feedback_backend.repository.SubjectRepository;
import com.feedback.feedback_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final FacultySubjectRepository facultySubjectRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;
    
    @Override
    public void run(String... args) throws Exception {
        // Ensure 'users.role' can store all roles (convert legacy ENUM to VARCHAR if needed)
        try {
            String colType = jdbcTemplate.queryForObject(
                "SELECT COLUMN_TYPE FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'",
                String.class
            );
            if (colType != null && colType.toLowerCase().contains("enum")) {
                jdbcTemplate.execute("ALTER TABLE users MODIFY role VARCHAR(20) NOT NULL");
            }
        } catch (Exception ignored) { }

        // Initialize sample data only if database is empty
        if (userRepository.count() == 0) {
            initializeSampleData();
        }
    }
    
    private void initializeSampleData() {
        // Create sample users
        User admin = new User();
        admin.setName("Admin User");
        admin.setEmail("admin@university.edu");
        admin.setPasswordHash(passwordEncoder.encode("admin123"));
        admin.setRole(User.Role.ADMIN);
        userRepository.save(admin);
        
        User student1 = new User();
        student1.setName("John Doe");
        student1.setEmail("john.doe@student.edu");
        student1.setPasswordHash(passwordEncoder.encode("student123"));
        student1.setRole(User.Role.STUDENT);
        userRepository.save(student1);
        
        User student2 = new User();
        student2.setName("Jane Smith");
        student2.setEmail("jane.smith@student.edu");
        student2.setPasswordHash(passwordEncoder.encode("student123"));
        student2.setRole(User.Role.STUDENT);
        userRepository.save(student2);
        
        // Create sample subjects
        Subject subject1 = new Subject();
        subject1.setSubjectCode("CS101");
        subject1.setSubjectName("Introduction to Computer Science");
        subjectRepository.save(subject1);
        
        Subject subject2 = new Subject();
        subject2.setSubjectCode("MATH201");
        subject2.setSubjectName("Calculus I");
        subjectRepository.save(subject2);
        
        Subject subject3 = new Subject();
        subject3.setSubjectCode("PHYS101");
        subject3.setSubjectName("Physics I");
        subjectRepository.save(subject3);
        
        // Create sample faculty
        Faculty faculty1 = new Faculty();
        faculty1.setName("Dr. Alice Johnson");
        faculty1.setEmail("alice.johnson@university.edu");
        faculty1.setDepartment("Computer Science");
        facultyRepository.save(faculty1);
        
        Faculty faculty2 = new Faculty();
        faculty2.setName("Prof. Bob Wilson");
        faculty2.setEmail("bob.wilson@university.edu");
        faculty2.setDepartment("Mathematics");
        facultyRepository.save(faculty2);
        
        Faculty faculty3 = new Faculty();
        faculty3.setName("Dr. Carol Davis");
        faculty3.setEmail("carol.davis@university.edu");
        faculty3.setDepartment("Physics");
        facultyRepository.save(faculty3);
        
        // Create faculty-subject mappings
        FacultySubject mapping1 = new FacultySubject(faculty1, subject1);
        facultySubjectRepository.save(mapping1);
        
        FacultySubject mapping2 = new FacultySubject(faculty2, subject2);
        facultySubjectRepository.save(mapping2);
        
        FacultySubject mapping3 = new FacultySubject(faculty3, subject3);
        facultySubjectRepository.save(mapping3);
        
        System.out.println("Sample data initialized successfully!");
    }
}