# Academic Feedback System - Backend

## Overview
This is the backend service for the Academic Feedback Management System built with Spring Boot.

## Features
- **User Authentication**: JWT-based authentication for Students and Admins
- **Subject Management**: CRUD operations for academic subjects
- **Faculty Management**: CRUD operations for faculty members
- **Faculty-Subject Mapping**: Assign faculty to subjects
- **Feedback Submission**: Students can submit feedback for faculty-subject combinations
- **Analytics**: Admin can view aggregated feedback reports

## Technology Stack
- **Spring Boot 3.5.6**
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **MySQL** database
- **Maven** for dependency management
- **Java 21**

## Prerequisites
- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+
- IDE (IntelliJ IDEA, Eclipse, or VS Code)

## Database Setup
1. Create a MySQL database named `feedback_db` (or it will be created automatically)
2. Update database credentials in `src/main/resources/application.properties` if needed

## Running the Application

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Install Dependencies
```bash
mvn clean install
```

### 3. Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8082`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject (Admin only)
- `GET /api/subjects/{id}` - Get subject by ID
- `PUT /api/subjects/{id}` - Update subject (Admin only)
- `DELETE /api/subjects/{id}` - Delete subject (Admin only)

### Faculty
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty` - Create faculty (Admin only)
- `GET /api/faculty/{id}` - Get faculty by ID
- `PUT /api/faculty/{id}` - Update faculty (Admin only)
- `DELETE /api/faculty/{id}` - Delete faculty (Admin only)

### Faculty-Subject Mapping
- `GET /api/faculty-subjects` - Get all mappings
- `POST /api/faculty-subjects` - Assign faculty to subject (Admin only)
- `GET /api/faculty-subjects/faculty/{facultyId}` - Get mappings by faculty
- `GET /api/faculty-subjects/subject/{subjectId}` - Get mappings by subject
- `DELETE /api/faculty-subjects` - Remove mapping (Admin only)

### Feedback
- `POST /api/feedback` - Submit feedback (Student only)
- `GET /api/feedback` - Get all feedback (Admin only)
- `GET /api/feedback/{id}` - Get feedback by ID
- `GET /api/feedback/student/{studentId}` - Get feedback by student
- `GET /api/feedback/faculty/{facultyId}` - Get feedback by faculty
- `GET /api/feedback/subject/{subjectId}` - Get feedback by subject

### Analytics
- `GET /api/analytics/subjects/{subjectId}` - Get subject analytics (Admin only)
- `GET /api/analytics/faculty/{facultyId}` - Get faculty analytics (Admin only)
- `GET /api/analytics/overall` - Get overall analytics (Admin only)

## Sample Data
The application automatically creates sample data on first run:
- **Admin User**: admin@university.edu / admin123
- **Student Users**: john.doe@student.edu / student123, jane.smith@student.edu / student123
- **Sample Subjects**: CS101, MATH201, PHYS101
- **Sample Faculty**: Dr. Alice Johnson, Prof. Bob Wilson, Dr. Carol Davis
- **Faculty-Subject Mappings**: Pre-configured assignments

## Security
- JWT tokens are required for all protected endpoints
- Role-based access control (STUDENT vs ADMIN)
- CORS enabled for http://localhost:5173 only

## Database Schema
The application uses the following main entities in the `feedback_db` database:
- `users` - User accounts (students and admins)
- `subjects` - Academic subjects
- `faculty` - Faculty members
- `faculty_subjects` - Many-to-many mapping between faculty and subjects
- `feedback` - Student feedback submissions

## Configuration
Key configuration properties in `application.properties`:
- Database connection settings
- JWT secret and expiration
- CORS allowed origins
- Server port (default: 8080)