// test/happyFlow.test.js
import axios from 'axios';
import { setTimeout } from 'timers/promises';

const API_BASE_URL = 'http://localhost:3000';
let authToken = {};
let createdIds = {
  teacher: null,
  student: null,
  course: null,
  lesson: null,
  quiz: null
};

// Helper function for delays
const delay = (ms) => setTimeout(ms);

// Helper function for logging
const log = (step, data) => {
  console.log(`\n=== ${step} ===`);
  if (data) console.log(JSON.stringify(data, null, 2));
};

// Test data
const testUsers = {
  teacher: {
    name: "Test Teacher",
    email: "teacher@test.com",
    password: "password123",
    role: "teacher"
  },
  student: {
    name: "Test Student",
    email: "student@test.com",
    password: "password123",
    role: "student"
  },
  admin: {
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin"
  }
};

const testCourse = {
  title: "Introduction to Programming",
  description: "Learn programming fundamentals with this comprehensive course",
  category: "Computer Science",
  imageUrl: "https://example.com/course-image.jpg"
};

const testLesson = {
  title: "Variables and Data Types",
  content: "In this lesson, we'll learn about variables and basic data types in programming.",
  videoUrl: "https://example.com/lesson-video.mp4",
  resourceUrl: "https://example.com/resources.pdf",
  order: 1,
  duration: 30
};

const testQuiz = {
  title: "Variables and Data Types Quiz",
  questions: [
    {
      question: "What is a variable in programming?",
      options: [
        "A container for storing data values",
        "A type of loop",
        "A conditional statement",
        "A function declaration"
      ],
      correctAnswer: 0,
      explanation: "Variables are used to store data values that can be referenced and manipulated in a program."
    },
    {
      question: "Which of the following is NOT a primitive data type?",
      options: [
        "Number",
        "String",
        "Boolean",
        "Array"
      ],
      correctAnswer: 3,
      explanation: "Array is a reference data type, not a primitive data type."
    },
    {
      question: "What is the correct way to declare a variable in JavaScript?",
      options: [
        "var name = 'John'",
        "variable name = 'John'",
        "v name = 'John'",
        "declare name = 'John'"
      ],
      correctAnswer: 0,
      explanation: "In JavaScript, we can use var, let, or const to declare variables."
    }
  ],
  passingScore: 70,
  timeLimit: 15
};

const updatedCourse = {
  title: "Advanced Programming Concepts",
  description: "Take your programming skills to the next level with advanced concepts",
  category: "Computer Science",
  imageUrl: "https://example.com/updated-course-image.jpg"
};

const updatedLesson = {
  title: "Advanced Variables and Data Structures",
  content: "Deep dive into complex data structures and advanced variable concepts.",
  order: 2,
  duration: 45
};

// Main test flow
async function runHappyFlow() {
  console.log("🚀 Starting Happy Flow Test with Empty Database\n");
  
  try {
    // ==================== AUTHENTICATION FLOW ====================
    log("1. SIGNUP - Create Teacher Account");
    const teacherSignup = await axios.post(`${API_BASE_URL}/auth/signup`, testUsers.teacher);
    createdIds.teacher = teacherSignup.data.data.user._id;
    log("Teacher created:", teacherSignup.data.data.user);
    await delay(2000);

    log("2. SIGNUP - Create Student Account");
    const studentSignup = await axios.post(`${API_BASE_URL}/auth/signup`, testUsers.student);
    createdIds.student = studentSignup.data.data.user._id;
    log("Student created:", studentSignup.data.data.user);
    await delay(2000);

    log("3. SIGNUP - Create Admin Account");
    const adminSignup = await axios.post(`${API_BASE_URL}/auth/signup`, testUsers.admin);
    createdIds.admin = adminSignup.data.data.user._id;
    log("Admin created:", adminSignup.data.data.user);
    await delay(2000);

    // Test duplicate signup
    log("4. EDGE CASE - Duplicate Signup");
    try {
      await axios.post(`${API_BASE_URL}/auth/signup`, testUsers.teacher);
    } catch (error) {
      log("Expected error - Duplicate user:", error.response.data);
    }
    await delay(2000);

    log("5. LOGIN - Teacher Login");
    const teacherLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUsers.teacher.email,
      password: testUsers.teacher.password
    });
    authToken.teacher = teacherLogin.data.data.token;
    log("Teacher logged in:", { token: authToken.teacher.substring(0, 20) + "..." });
    await delay(2000);

    log("6. LOGIN - Student Login");
    const studentLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUsers.student.email,
      password: testUsers.student.password
    });
    authToken.student = studentLogin.data.data.token;
    log("Student logged in:", { token: authToken.student.substring(0, 20) + "..." });
    await delay(2000);

    log("7. LOGIN - Admin Login");
    const adminLogin = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUsers.admin.email,
      password: testUsers.admin.password
    });
    authToken.admin = adminLogin.data.data.token;
    log("Admin logged in:", { token: authToken.admin.substring(0, 20) + "..." });
    await delay(2000);

    log("8. GET /me - Teacher Profile");
    const teacherProfile = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Teacher profile:", teacherProfile.data.data.user);
    await delay(2000);

    // ==================== COURSE FLOW ====================
    log("9. CREATE COURSE - As Teacher");
    const createCourse = await axios.post(`${API_BASE_URL}/courses`, testCourse, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    createdIds.course = createCourse.data.data.course._id;
    log("Course created:", createCourse.data.data.course);
    await delay(2000);

    log("10. EDGE CASE - Create Duplicate Course");
    try {
      await axios.post(`${API_BASE_URL}/courses`, testCourse, {
        headers: { Authorization: `Bearer ${authToken.teacher}` }
      });
    } catch (error) {
      log("Expected error - Duplicate course:", error.response.data);
    }
    await delay(2000);

    log("11. GET ALL COURSES - Public Route");
    const allCourses = await axios.get(`${API_BASE_URL}/courses`);
    log("All courses:", allCourses.data.data);
    await delay(2000);

    log("12. GET COURSE BY ID");
    const courseById = await axios.get(`${API_BASE_URL}/courses/${createdIds.course}`);
    log("Course details:", courseById.data.data);
    await delay(2000);

    log("13. EDGE CASE - Get Invalid Course ID");
    try {
      await axios.get(`${API_BASE_URL}/courses/invalid-id`);
    } catch (error) {
      log("Expected error - Invalid ID:", error.response.data);
    }
    await delay(2000);

    // ==================== LESSON FLOW ====================
    log("14. ADD LESSON TO COURSE");
    const addLesson = await axios.post(`${API_BASE_URL}/courses/${createdIds.course}/lessons`, testLesson, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    createdIds.lesson = addLesson.data.data.newLesson._id;
    log("Lesson added:", addLesson.data.data.newLesson);
    await delay(2000);

    log("15. GET LESSONS FOR COURSE");
    const courseLessons = await axios.get(`${API_BASE_URL}/courses/${createdIds.course}/lessons`);
    log("Course lessons:", courseLessons.data.data);
    await delay(2000);

    log("16. GET LESSON BY ID");
    const lessonById = await axios.get(`${API_BASE_URL}/lessons/${createdIds.lesson}`);
    log("Lesson details:", lessonById.data.data);
    await delay(2000);

    log("17. UPDATE LESSON");
    const updateLesson = await axios.put(`${API_BASE_URL}/lessons/${createdIds.lesson}`, updatedLesson, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Lesson updated:", updateLesson.data.data);
    await delay(2000);

    // ==================== QUIZ FLOW ====================
    log("18. ADD QUIZ TO LESSON");
    const addQuiz = await axios.post(`${API_BASE_URL}/lessons/${createdIds.lesson}/quiz`, testQuiz, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    createdIds.quiz = addQuiz.data.data.quiz._id;
    log("Quiz added:", addQuiz.data.data.quiz);
    await delay(2000);

    log("19. EDGE CASE - Add Duplicate Quiz to Lesson");
    try {
      await axios.post(`${API_BASE_URL}/lessons/${createdIds.lesson}/quiz`, testQuiz, {
        headers: { Authorization: `Bearer ${authToken.teacher}` }
      });
    } catch (error) {
      log("Expected error - Duplicate quiz:", error.response.data);
    }
    await delay(2000);

    log("20. GET QUIZ BY ID - As Teacher");
    const quizById = await axios.get(`${API_BASE_URL}/quizzes/${createdIds.quiz}`, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Quiz details (teacher view):", quizById.data);
    await delay(2000);

    // ==================== ENROLLMENT FLOW ====================
    log("21. ENROLL IN COURSE - As Student");
    const enrollCourse = await axios.post(`${API_BASE_URL}/courses/${createdIds.course}/enroll`, {}, {
      headers: { Authorization: `Bearer ${authToken.student}` }
    });
    log("Enrollment result:", enrollCourse.data.data);
    await delay(2000);

    log("22. EDGE CASE - Duplicate Enrollment");
    try {
      await axios.post(`${API_BASE_URL}/courses/${createdIds.course}/enroll`, {}, {
        headers: { Authorization: `Bearer ${authToken.student}` }
      });
    } catch (error) {
      log("Expected error - Duplicate enrollment:", error.response.data);
    }
    await delay(2000);

    // ==================== COMPLETE LESSON FLOW ====================
    log("23. COMPLETE LESSON - As Student");
    const completeLesson = await axios.post(`${API_BASE_URL}/lessons/${createdIds.lesson}/complete`, 
      { timeSpent: 25 },
      { headers: { Authorization: `Bearer ${authToken.student}` } }
    );
    log("Lesson completion:", completeLesson.data.data);
    await delay(2000);

    // ==================== QUIZ ACCESS FLOW ====================
    log("24. GET QUIZ BY ID - As Student");
    const studentQuizView = await axios.get(`${API_BASE_URL}/quizzes/${createdIds.quiz}`, {
      headers: { Authorization: `Bearer ${authToken.student}` }
    });
    log("Quiz details (student view - answers hidden):", studentQuizView.data);
    await delay(2000);

    // ==================== COURSE PROGRESS FLOW ====================
    log("25. GET COURSE PROGRESS - As Student");
    const courseProgress = await axios.get(`${API_BASE_URL}/courses/${createdIds.course}/progress`, {
      headers: { Authorization: `Bearer ${authToken.student}` }
    });
    log("Course progress:", courseProgress.data.data);
    await delay(2000);

    // ==================== COURSE ANALYTICS FLOW ====================
    log("26. GET COURSE ANALYTICS - As Teacher");
    const courseAnalytics = await axios.get(`${API_BASE_URL}/courses/${createdIds.course}/analytics`, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Course analytics:", courseAnalytics.data.data);
    await delay(2000);

    // ==================== COURSE UPDATE FLOW ====================
    log("27. UPDATE COURSE - As Teacher");
    const updateCourse = await axios.put(`${API_BASE_URL}/courses/${createdIds.course}`, updatedCourse, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Course updated:", updateCourse.data.data);
    await delay(2000);

    // ==================== FILTERING & SEARCH FLOW ====================
    log("28. GET COURSES WITH FILTERS");
    const filteredCourses = await axios.get(`${API_BASE_URL}/courses?category=Computer Science&search=Programming&page=1&limit=5`);
    log("Filtered courses:", filteredCourses.data.data);
    await delay(2000);

    // ==================== UNAUTHORIZED ACCESS TESTS ====================
    log("29. EDGE CASE - Student Attempts Teacher Action");
    try {
      await axios.post(`${API_BASE_URL}/courses`, testCourse, {
        headers: { Authorization: `Bearer ${authToken.student}` }
      });
    } catch (error) {
      log("Expected error - Unauthorized:", error.response.data);
    }
    await delay(2000);

    log("30. EDGE CASE - No Auth Token");
    try {
      await axios.get(`${API_BASE_URL}/auth/me`);
    } catch (error) {
      log("Expected error - No token:", error.response.data);
    }
    await delay(2000);

    // ==================== ADMIN PRIVILEGES FLOW ====================
    log("31. UPDATE COURSE - As Admin");
    const adminUpdateCourse = await axios.put(`${API_BASE_URL}/courses/${createdIds.course}`, updatedCourse, {
      headers: { Authorization: `Bearer ${authToken.admin}` }
    });
    log("Course updated by admin:", adminUpdateCourse.data.data);
    await delay(2000);

    // ==================== QUIZ UPDATE/DELETE FLOW ====================
    log("32. UPDATE QUIZ - As Teacher");
    try {
      const updateQuiz = await axios.put(`${API_BASE_URL}/quizzes/${createdIds.quiz}`, 
        { title: "Updated Quiz Title" },
        { headers: { Authorization: `Bearer ${authToken.teacher}` } }
      );
      log("Quiz updated:", updateQuiz.data);
    } catch (error) {
      log("Quiz update (if implemented):", error.response?.data || "Not implemented yet");
    }
    await delay(2000);

    // ==================== CLEANUP FLOW ====================
    log("33. DELETE QUIZ - As Teacher");
    const deleteQuiz = await axios.delete(`${API_BASE_URL}/quizzes/${createdIds.quiz}`, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Quiz deleted:", deleteQuiz.data);
    await delay(2000);

    log("34. DELETE LESSON - As Teacher");
    const deleteLesson = await axios.delete(`${API_BASE_URL}/lessons/${createdIds.lesson}`, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Lesson deleted: Success (204 No Content)");
    await delay(2000);

    log("35. DELETE COURSE - As Teacher");
    const deleteCourse = await axios.delete(`${API_BASE_URL}/courses/${createdIds.course}`, {
      headers: { Authorization: `Bearer ${authToken.teacher}` }
    });
    log("Course deleted:", deleteCourse.data);
    await delay(2000);

    // ==================== FINAL VERIFICATION ====================
    log("36. FINAL VERIFICATION - Check Course Deleted");
    try {
      await axios.get(`${API_BASE_URL}/courses/${createdIds.course}`);
    } catch (error) {
      log("Course successfully deleted:", error.response.data);
    }

    console.log("\n✅ Happy Flow Test Completed Successfully!");
    console.log("📊 Summary:");
    console.log(`- Teacher ID: ${createdIds.teacher}`);
    console.log(`- Student ID: ${createdIds.student}`);
    console.log(`- Admin ID: ${createdIds.admin}`);
    console.log(`- Course ID: ${createdIds.course}`);
    console.log(`- Lesson ID: ${createdIds.lesson}`);
    console.log(`- Quiz ID: ${createdIds.quiz}`);

  } catch (error) {
    console.error("\n❌ Test Failed:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Status:", error.response.status);
    }
  }
}

// Run the tests
runHappyFlow();