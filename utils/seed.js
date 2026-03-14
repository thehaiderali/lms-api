// backend/seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import "dotenv/config";
import { connectDB } from "./db.js";

// Import models
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Lesson from "../models/lesson.model.js";
import Quiz from "../models/quiz.model.js";
import Enrollment from "../models/enrollment.model.js";
import Progress from "../models/progress.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";

const generateUsers = async () => {
  const password = await bcrypt.hash("password123", 10);
  
  return [
    // Admin users
    {
      name: "Admin User",
      email: "admin@lms.com",
      password,
      role: "admin"
    },
    {
      name: "Super Admin",
      email: "superadmin@lms.com",
      password,
      role: "admin"
    },
    
    // Teacher users
    {
      name: "John Smith",
      email: "john.smith@lms.com",
      password,
      role: "teacher"
    },
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@lms.com",
      password,
      role: "teacher"
    },
    {
      name: "Michael Chen",
      email: "michael.chen@lms.com",
      password,
      role: "teacher"
    },
    {
      name: "Emily Rodriguez",
      email: "emily.rodriguez@lms.com",
      password,
      role: "teacher"
    },
    {
      name: "David Kim",
      email: "david.kim@lms.com",
      password,
      role: "teacher"
    },
    
    // Student users
    {
      name: "Alice Brown",
      email: "alice.brown@lms.com",
      password,
      role: "student"
    },
    {
      name: "Bob Wilson",
      email: "bob.wilson@lms.com",
      password,
      role: "student"
    },
    {
      name: "Carol Martinez",
      email: "carol.martinez@lms.com",
      password,
      role: "student"
    },
    {
      name: "Daniel Lee",
      email: "daniel.lee@lms.com",
      password,
      role: "student"
    },
    {
      name: "Emma Davis",
      email: "emma.davis@lms.com",
      password,
      role: "student"
    },
    {
      name: "Frank Thompson",
      email: "frank.thompson@lms.com",
      password,
      role: "student"
    },
    {
      name: "Grace Wang",
      email: "grace.wang@lms.com",
      password,
      role: "student"
    },
    {
      name: "Henry Garcia",
      email: "henry.garcia@lms.com",
      password,
      role: "student"
    },
    {
      name: "Isabella Taylor",
      email: "isabella.taylor@lms.com",
      password,
      role: "student"
    },
    {
      name: "James Anderson",
      email: "james.anderson@lms.com",
      password,
      role: "student"
    }
  ];
};

const generateCourses = (teacherIds) => {
  const courses = [
    {
      title: "Introduction to Web Development",
      description: "Learn the fundamentals of web development including HTML, CSS, and JavaScript. This comprehensive course will take you from absolute beginner to building your first responsive website.",
      category: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Advanced JavaScript: From Basics to Frameworks",
      description: "Master modern JavaScript concepts including ES6+, asynchronous programming, and popular frameworks. Perfect for developers looking to level up their skills.",
      category: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Calculus I: Limits, Derivatives, and Integrals",
      description: "A comprehensive introduction to calculus covering limits, derivatives, integrals, and their applications. Includes practical examples and step-by-step problem solving.",
      category: "Math",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Physics: Mechanics and Motion",
      description: "Explore the fundamental principles of classical mechanics including Newton's laws, energy conservation, and rotational motion. Hands-on experiments and simulations included.",
      category: "Science",
      imageUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "English Literature: Shakespeare's Masterpieces",
      description: "Dive deep into the works of William Shakespeare. Analyze Hamlet, Macbeth, and Romeo and Juliet while understanding the historical context and literary devices.",
      category: "English",
      imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "World History: The 20th Century",
      description: "Understand the major events that shaped the modern world, from World Wars to the Digital Revolution. Examine political, social, and technological changes.",
      category: "History",
      imageUrl: "https://images.unsplash.com/photo-1461360370896-922624e12c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Data Science Fundamentals",
      description: "Learn the basics of data science including data visualization, statistical analysis, and machine learning concepts using Python.",
      category: "Computer Science",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Linear Algebra for Machine Learning",
      description: "Essential linear algebra concepts for machine learning and data science. Covers vectors, matrices, eigenvalues, and their applications in ML.",
      category: "Math",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Chemistry: Organic Compounds",
      description: "Introduction to organic chemistry including hydrocarbon structures, functional groups, and reaction mechanisms. Laboratory demonstrations included.",
      category: "Science",
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    },
    {
      title: "Creative Writing Workshop",
      description: "Develop your creative writing skills through exercises in fiction, poetry, and creative non-fiction. Peer review and instructor feedback included.",
      category: "English",
      imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      isPublished: true
    }
  ];

  // Assign random teachers to courses
  return courses.map((course, index) => ({
    ...course,
    teacherId: teacherIds[index % teacherIds.length],
    enrolledStudents: []
  }));
};

const generateLessons = (courseIds) => {
  const lessons = [];

  // Web Development Course Lessons
  lessons.push(
    {
      title: "HTML Fundamentals",
      content: "Learn the basics of HTML including tags, attributes, and document structure. We'll cover headings, paragraphs, links, images, and lists.",
      videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      order: 1,
      duration: 45,
      courseId: courseIds[0]
    },
    {
      title: "CSS Styling Basics",
      content: "Understand CSS selectors, properties, and values. Learn to style your HTML with colors, fonts, margins, and padding.",
      videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      order: 2,
      duration: 60,
      courseId: courseIds[0]
    },
    {
      title: "CSS Layouts: Flexbox and Grid",
      content: "Master modern CSS layout techniques including Flexbox and Grid systems for creating responsive designs.",
      videoUrl: "https://www.youtube.com/watch?v=3YW65K6LcIA",
      resourceUrl: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
      order: 3,
      duration: 75,
      courseId: courseIds[0]
    },
    {
      title: "JavaScript Basics",
      content: "Introduction to JavaScript: variables, data types, functions, and control flow. Start making your websites interactive.",
      videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      order: 4,
      duration: 90,
      courseId: courseIds[0]
    },
    {
      title: "DOM Manipulation",
      content: "Learn to manipulate the Document Object Model (DOM) with JavaScript to create dynamic web experiences.",
      videoUrl: "https://www.youtube.com/watch?v=5fb2aPlgoys",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model",
      order: 5,
      duration: 60,
      courseId: courseIds[0]
    }
  );

  // JavaScript Advanced Course Lessons
  lessons.push(
    {
      title: "ES6+ Features",
      content: "Explore modern JavaScript features including arrow functions, destructuring, spread operators, and template literals.",
      videoUrl: "https://www.youtube.com/watch?v=NCwa_xi0Uuc",
      resourceUrl: "https://www.w3schools.com/js/js_es6.asp",
      order: 1,
      duration: 55,
      courseId: courseIds[1]
    },
    {
      title: "Asynchronous JavaScript",
      content: "Master callbacks, promises, and async/await for handling asynchronous operations in JavaScript.",
      videoUrl: "https://www.youtube.com/watch?v=PoRJizFvM7s",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous",
      order: 2,
      duration: 70,
      courseId: courseIds[1]
    },
    {
      title: "Closures and Scope",
      content: "Deep dive into JavaScript closures, lexical scoping, and execution context for better code organization.",
      videoUrl: "https://www.youtube.com/watch?v=-xqJo5VRP4A",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
      order: 3,
      duration: 45,
      courseId: courseIds[1]
    },
    {
      title: "Object-Oriented JavaScript",
      content: "Learn about prototypes, classes, and inheritance patterns in JavaScript.",
      videoUrl: "https://www.youtube.com/watch?v=PFmuCDHHpwk",
      resourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects",
      order: 4,
      duration: 65,
      courseId: courseIds[1]
    }
  );

  // Calculus Course Lessons
  lessons.push(
    {
      title: "Limits and Continuity",
      content: "Understanding the concept of limits and continuity of functions. Learn to evaluate limits analytically and graphically.",
      videoUrl: "https://www.youtube.com/watch?v=YNstP0ESndU",
      resourceUrl: "https://www.khanacademy.org/math/ap-calculus-ab/ab-limits-new",
      order: 1,
      duration: 80,
      courseId: courseIds[2]
    },
    {
      title: "Derivatives: Definition and Rules",
      content: "Introduction to derivatives, including power rule, product rule, quotient rule, and chain rule.",
      videoUrl: "https://www.youtube.com/watch?v=Wv2vJRYvD-c",
      resourceUrl: "https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-1-new",
      order: 2,
      duration: 90,
      courseId: courseIds[2]
    },
    {
      title: "Applications of Derivatives",
      content: "Using derivatives to solve optimization problems, find rates of change, and analyze function behavior.",
      videoUrl: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
      resourceUrl: "https://tutorial.math.lamar.edu/Classes/CalcI/AppsOfDerivatives.aspx",
      order: 3,
      duration: 85,
      courseId: courseIds[2]
    },
    {
      title: "Introduction to Integration",
      content: "Basic concepts of integration, indefinite integrals, and the Fundamental Theorem of Calculus.",
      videoUrl: "https://www.youtube.com/watch?v=rfG8ce4nNh0",
      resourceUrl: "https://www.khanacademy.org/math/ap-calculus-ab/ab-integration-new",
      order: 4,
      duration: 95,
      courseId: courseIds[2]
    }
  );

  // Physics Course Lessons
  lessons.push(
    {
      title: "Newton's Laws of Motion",
      content: "Comprehensive study of Newton's three laws and their applications in real-world scenarios.",
      videoUrl: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
      resourceUrl: "https://www.physicsclassroom.com/class/newtlaws",
      order: 1,
      duration: 70,
      courseId: courseIds[3]
    },
    {
      title: "Energy and Work",
      content: "Understanding kinetic and potential energy, work-energy theorem, and conservation of energy.",
      videoUrl: "https://www.youtube.com/watch?v=w4QFJb9a9vo",
      resourceUrl: "https://www.khanacademy.org/science/physics/work-and-energy",
      order: 2,
      duration: 65,
      courseId: courseIds[3]
    },
    {
      title: "Rotational Motion",
      content: "Exploring angular velocity, torque, moment of inertia, and rotational dynamics.",
      videoUrl: "https://www.youtube.com/watch?v=0MOYcPZjE68",
      resourceUrl: "https://openstax.org/books/university-physics-volume-1/pages/10-introduction",
      order: 3,
      duration: 75,
      courseId: courseIds[3]
    }
  );

  // Add more lessons for other courses...
  // Data Science Course Lessons
  lessons.push(
    {
      title: "Python for Data Science",
      content: "Introduction to Python programming with focus on data science libraries and tools.",
      videoUrl: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
      resourceUrl: "https://www.python.org/about/gettingstarted/",
      order: 1,
      duration: 90,
      courseId: courseIds[6]
    },
    {
      title: "Data Visualization with Matplotlib",
      content: "Create compelling visualizations using Matplotlib and Seaborn for data analysis.",
      videoUrl: "https://www.youtube.com/watch?v=UO98lJQ3QGI",
      resourceUrl: "https://matplotlib.org/stable/tutorials/index.html",
      order: 2,
      duration: 75,
      courseId: courseIds[6]
    },
    {
      title: "Statistical Analysis with Pandas",
      content: "Learn data manipulation and statistical analysis using the Pandas library.",
      videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg",
      resourceUrl: "https://pandas.pydata.org/docs/getting_started/index.html",
      order: 3,
      duration: 85,
      courseId: courseIds[6]
    }
  );

  return lessons;
};

const generateQuizzes = (lessonIds, courseIds) => {
  const quizzes = [
    // Quiz for Web Development Lesson 1
    {
      lessonId: lessonIds[0],
      title: "HTML Fundamentals Quiz",
      questions: [
        {
          question: "What does HTML stand for?",
          options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
          ],
          correctAnswer: 0,
          explanation: "HTML stands for Hyper Text Markup Language, the standard markup language for creating web pages."
        },
        {
          question: "Which tag is used for the largest heading?",
          options: ["<h6>", "<heading>", "<h1>", "<head>"],
          correctAnswer: 2,
          explanation: "<h1> is the largest heading tag, while <h6> is the smallest."
        },
        {
          question: "What is the correct HTML for creating a hyperlink?",
          options: [
            "<a url='https://example.com'>Link</a>",
            "<a href='https://example.com'>Link</a>",
            "<link src='https://example.com'>Link</link>",
            "<hyperlink>https://example.com</hyperlink>"
          ],
          correctAnswer: 1,
          explanation: "The anchor tag <a> with the href attribute is used to create hyperlinks."
        },
        {
          question: "Which tag is used to insert an image?",
          options: ["<img>", "<image>", "<pic>", "<src>"],
          correctAnswer: 0,
          explanation: "The <img> tag is used to embed images in HTML documents."
        }
      ],
      passingScore: 70,
      timeLimit: 10
    },
    // Quiz for JavaScript Basics
    {
      lessonId: lessonIds[3],
      title: "JavaScript Fundamentals Quiz",
      questions: [
        {
          question: "Which of the following is NOT a JavaScript data type?",
          options: ["String", "Boolean", "Integer", "Undefined"],
          correctAnswer: 2,
          explanation: "JavaScript uses dynamic types. 'Integer' is not a separate type; numbers are simply 'Number' type."
        },
        {
          question: "How do you declare a variable in JavaScript?",
          options: [
            "var myVar;",
            "variable myVar;",
            "v myVar;",
            "declare myVar;"
          ],
          correctAnswer: 0,
          explanation: "Variables can be declared using 'var', 'let', or 'const' keywords."
        },
        {
          question: "What will console.log(typeof []) output?",
          options: ["array", "object", "list", "undefined"],
          correctAnswer: 1,
          explanation: "In JavaScript, arrays are objects, so typeof [] returns 'object'."
        },
        {
          question: "Which method adds an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: 0,
          explanation: "push() adds one or more elements to the end of an array and returns the new length."
        }
      ],
      passingScore: 70,
      timeLimit: 15
    },
    // Quiz for Limits and Continuity
    {
      lessonId: lessonIds[4],
      title: "Limits and Continuity Assessment",
      questions: [
        {
          question: "What is the limit of (x² - 1)/(x - 1) as x approaches 1?",
          options: ["0", "1", "2", "Undefined"],
          correctAnswer: 2,
          explanation: "Factor the numerator as (x-1)(x+1), cancel (x-1), and substitute x=1 to get 2."
        },
        {
          question: "A function is continuous at x = a if:",
          options: [
            "f(a) exists only",
            "lim x→a f(x) exists only",
            "lim x→a f(x) = f(a)",
            "f(a) is defined and finite"
          ],
          correctAnswer: 2,
          explanation: "For continuity at a point, the function must be defined, the limit must exist, and both must be equal."
        }
      ],
      passingScore: 60,
      timeLimit: 10
    },
    // Quiz for Newton's Laws
    {
      lessonId: lessonIds[8],
      title: "Newton's Laws Quiz",
      questions: [
        {
          question: "Newton's First Law is also known as:",
          options: [
            "Law of Inertia",
            "Law of Acceleration",
            "Law of Action-Reaction",
            "Law of Gravitation"
          ],
          correctAnswer: 0,
          explanation: "Newton's First Law states that an object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by a force."
        },
        {
          question: "Force equals:",
          options: ["m × a", "m / a", "m + a", "m - a"],
          correctAnswer: 0,
          explanation: "Newton's Second Law states F = ma (force equals mass times acceleration)."
        }
      ],
      passingScore: 70,
      timeLimit: 8
    }
  ];

  return quizzes;
};

const generateEnrollments = (studentIds, courseIds) => {
  const enrollments = [];
  
  // Enroll each student in 3-5 random courses
  studentIds.forEach(studentId => {
    const numCourses = Math.floor(Math.random() * 3) + 3; // 3-5 courses
    
    // Shuffle course IDs and take first numCourses
    const shuffled = [...courseIds].sort(() => 0.5 - Math.random());
    const selectedCourses = shuffled.slice(0, numCourses);
    
    selectedCourses.forEach((courseId, index) => {
      // Random enrollment dates within last 3 months
      const enrollmentDate = new Date();
      enrollmentDate.setDate(enrollmentDate.getDate() - Math.floor(Math.random() * 90));
      
      // Random completion status (30% chance completed)
      const completed = Math.random() < 0.3;
      
      enrollments.push({
        courseId,
        studentId,
        enrolledAt: enrollmentDate,
        completedAt: completed ? new Date(enrollmentDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : null,
        isActive: !completed
      });
    });
  });

  return enrollments;
};

const generateProgress = (studentIds, lessonIds, courseIds) => {
  const progress = [];
  
  // For each student, mark 30-70% of lessons as completed
  studentIds.forEach(studentId => {
    // Group lessons by course
    const lessonsByCourse = {};
    lessonIds.forEach((lessonId, index) => {
      const courseIndex = Math.floor(index / 5); // Rough grouping, adjust as needed
      const courseId = courseIds[courseIndex % courseIds.length];
      if (!lessonsByCourse[courseId]) {
        lessonsByCourse[courseId] = [];
      }
      lessonsByCourse[courseId].push(lessonId);
    });

    // For each course the student is enrolled in, mark some lessons as completed
    Object.entries(lessonsByCourse).forEach(([courseId, courseLessonIds]) => {
      const completionRate = Math.random() * 0.4 + 0.3; // 30-70% completion
      const numCompleted = Math.floor(courseLessonIds.length * completionRate);
      
      // Randomly select lessons to mark as completed
      const shuffled = [...courseLessonIds].sort(() => 0.5 - Math.random());
      const completedLessons = shuffled.slice(0, numCompleted);
      
      completedLessons.forEach(lessonId => {
        const completedAt = new Date();
        completedAt.setDate(completedAt.getDate() - Math.floor(Math.random() * 30));
        
        progress.push({
          studentId,
          lessonId,
          courseId,
          completed: true,
          completedAt,
          timeSpent: Math.floor(Math.random() * 30) + 15 // 15-45 minutes
        });
      });
    });
  });

  return progress;
};

const generateQuizAttempts = (studentIds, quizIds, lessonIds, courseIds) => {
  const attempts = [];
  
  studentIds.forEach(studentId => {
    // Each student attempts 30-60% of quizzes
    const numAttempts = Math.floor(Math.random() * (quizIds.length * 0.3)) + Math.floor(quizIds.length * 0.3);
    
    // Randomly select quizzes to attempt
    const shuffledQuizIds = [...quizIds].sort(() => 0.5 - Math.random());
    const selectedQuizIndices = shuffledQuizIds.slice(0, numAttempts);
    
    selectedQuizIndices.forEach((quizId, index) => {
      // Random score between 40-100
      const score = Math.floor(Math.random() * 60) + 40;
      const correctAnswers = Math.floor((score / 100) * 4); // Assuming 4 questions
      const passed = score >= 70;
      
      attempts.push({
        studentId,
        quizId,
        lessonId: lessonIds[index % lessonIds.length],
        courseId: courseIds[index % courseIds.length],
        answers: [
          { questionId: new mongoose.Types.ObjectId(), selectedOption: 0, isCorrect: true },
          { questionId: new mongoose.Types.ObjectId(), selectedOption: 1, isCorrect: false },
          { questionId: new mongoose.Types.ObjectId(), selectedOption: 2, isCorrect: true },
          { questionId: new mongoose.Types.ObjectId(), selectedOption: 3, isCorrect: false }
        ],
        score,
        totalQuestions: 4,
        correctAnswers,
        passed,
        submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        timeTaken: Math.floor(Math.random() * 10) + 5 // 5-15 minutes
      });
    });
  });

  return attempts;
};

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("📦 Connected to MongoDB");

    // Clear existing data
    console.log("\n🧹 Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({}),
      Lesson.deleteMany({}),
      Quiz.deleteMany({}),
      Enrollment.deleteMany({}),
      Progress.deleteMany({}),
      QuizAttempt.deleteMany({})
    ]);
    console.log("✅ Database cleared");

    // Create users
    console.log("\n👥 Creating users...");
    const userData = await generateUsers();
    const users = await User.insertMany(userData);
    
    const adminIds = users.filter(u => u.role === 'admin').map(u => u._id);
    const teacherIds = users.filter(u => u.role === 'teacher').map(u => u._id);
    const studentIds = users.filter(u => u.role === 'student').map(u => u._id);
    
    console.log(`   Created: ${adminIds.length} admins, ${teacherIds.length} teachers, ${studentIds.length} students`);

    // Create courses
    console.log("\n📚 Creating courses...");
    const courseData = generateCourses(teacherIds);
    const courses = await Course.insertMany(courseData);
    const courseIds = courses.map(c => c._id);
    console.log(`   Created ${courseIds.length} courses`);

    // Create lessons
    console.log("\n📝 Creating lessons...");
    const lessonData = generateLessons(courseIds);
    const lessons = await Lesson.insertMany(lessonData);
    const lessonIds = lessons.map(l => l._id);
    console.log(`   Created ${lessonIds.length} lessons`);

    // Create quizzes
    console.log("\n❓ Creating quizzes...");
    const quizData = generateQuizzes(lessonIds, courseIds);
    const quizzes = await Quiz.insertMany(quizData);
    const quizIds = quizzes.map(q => q._id);
    console.log(`   Created ${quizIds.length} quizzes`);

    // Create enrollments
    console.log("\n📋 Creating enrollments...");
    const enrollmentData = generateEnrollments(studentIds, courseIds);
    const enrollments = await Enrollment.insertMany(enrollmentData);
    console.log(`   Created ${enrollments.length} enrollments`);

    // Update courses with enrolled students
    console.log("\n🔄 Updating course enrollments...");
    const enrollmentGroups = {};
    enrollments.forEach(e => {
      if (!enrollmentGroups[e.courseId]) {
        enrollmentGroups[e.courseId] = [];
      }
      enrollmentGroups[e.courseId].push(e.studentId);
    });

    await Promise.all(
      Object.entries(enrollmentGroups).map(([courseId, studentIds]) =>
        Course.findByIdAndUpdate(courseId, { $set: { enrolledStudents: studentIds } })
      )
    );

    // Create progress records
    console.log("\n📊 Creating progress records...");
    const progressData = generateProgress(studentIds, lessonIds, courseIds);
    const progress = await Progress.insertMany(progressData);
    console.log(`   Created ${progress.length} progress records`);

    // Create quiz attempts
    console.log("\n🎯 Creating quiz attempts...");
    const attemptData = generateQuizAttempts(studentIds, quizIds, lessonIds, courseIds);
    const attempts = await QuizAttempt.insertMany(attemptData);
    console.log(`   Created ${attempts.length} quiz attempts`);

    // Display summary
    console.log("\n✅ SEEDING COMPLETED SUCCESSFULLY!");
    console.log("\n📊 Database Summary:");
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📚 Courses: ${courses.length}`);
    console.log(`   📝 Lessons: ${lessons.length}`);
    console.log(`   ❓ Quizzes: ${quizzes.length}`);
    console.log(`   📋 Enrollments: ${enrollments.length}`);
    console.log(`   📊 Progress Records: ${progress.length}`);
    console.log(`   🎯 Quiz Attempts: ${attempts.length}`);

    console.log("\n🔑 Test User Credentials:");
    console.log("   Admin: admin@lms.com / password123");
    console.log("   Teacher: john.smith@lms.com / password123");
    console.log("   Student: alice.brown@lms.com / password123");

  } catch (error) {
    console.error("\n❌ Error seeding database:", error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log("\n🔒 Database connection closed");
  }
};

// Run the seed function
seedDatabase();