# LMS Platform API

A Learning Management System API built with Node.js, Express, and MongoDB.

## Tech Stack

- Node.js / Express
- MongoDB with Mongoose
- JWT Authentication
- Zod Validation

## Features

- User authentication (Student, Teacher, Admin roles)
- Course management (CRUD operations)
- Lesson management
- Quiz creation and attempts
- Course enrollment
- Progress tracking
- Analytics for teachers/admins

## API Endpoints

### Authentication
```
POST   /auth/signup     - Register new user
POST   /auth/login      - User login
GET    /auth/me         - Get current user
```

### Courses
```
POST   /courses         - Create course (Teacher/Admin)
GET    /courses         - List all courses (Public)
GET    /courses/:id     - Get course details (Public)
PUT    /courses/:id     - Update course (Teacher/Admin)
DELETE /courses/:id     - Delete course (Teacher/Admin)
POST   /courses/:id/enroll - Enroll in course (Student)
```

### Lessons
```
GET    /lessons/:id     - Get lesson details (Public)
PUT    /lessons/:id     - Update lesson (Teacher/Admin)
DELETE /lessons/:id     - Delete lesson (Teacher/Admin)
POST   /lessons/:id/quiz - Add quiz to lesson (Teacher/Admin)
POST   /lessons/:id/complete - Mark lesson complete (Student)
```

### Course Specific
```
GET    /courses/:id/lessons   - Get course lessons (Public)
GET    /courses/:id/progress  - Get student progress (Student)
GET    /courses/:id/analytics - Get course analytics (Teacher/Admin)
```

### Quizzes
```
GET    /quizzes/:id     - Get quiz (Authenticated)
PUT    /quizzes/:id     - Update quiz (Teacher/Admin)
DELETE /quizzes/:id     - Delete quiz (Teacher/Admin)
```

## Installation

1. Clone repository
2. Install dependencies
```
npm install
```
3. Create .env file
```
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
4. Start server
```
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 3000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT tokens |

## User Roles

- **Student**: Can view courses, enroll, complete lessons, take quizzes
- **Teacher**: Can create/manage own courses, lessons, quizzes
- **Admin**: Full access to all resources

## Database Models

- User (name, email, password, role)
- Course (title, description, category, teacherId)
- Lesson (title, content, videoUrl, order, courseId)
- Quiz (title, questions, passingScore, lessonId)
- Enrollment (studentId, courseId)
- Progress (studentId, lessonId, completed)
- QuizAttempt (studentId, quizId, score, answers)

## Validation

All inputs validated using Zod schemas:
- Signup/Login validation
- Course creation/update
- Lesson creation/update
- Quiz creation/update

## Error Handling

Standard error response format:
```json
{
  "success": false,
  "error": "Error message"
}
```

Success response format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

## License

ISC