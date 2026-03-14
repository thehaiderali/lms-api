import {z} from "zod"

export function zodErrorParser(issues){
    let error=""
    for  (const issue of issues){
      error.concat(issue.message);
      error.concat("\n");

    }
    return error
}
 
export const signUpSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z .email("Invalid email format"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["teacher", "student","admin"], {
    errorMap: () => ({ message: "Role must be 'teacher' or 'student'" })
  })
});

export const loginSchema = z.object({
  email: z .email("Invalid email format"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
});



export const createCourseSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  category: z.enum(["Math", "Science", "English", "History", "Computer Science", "Other"]),
  imageUrl: z.url("Invalid URL format").optional()
});


export const createLessonSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),
  content: z.string()
    .min(10, "Content must be at least 10 characters")
    .optional(), // Make it optional
  videoUrl: z.string()
    .url("Invalid URL format")
    .optional()
    .nullable(), // Allow null/undefined
  resourceUrl: z.string()
    .url("Invalid URL format")
    .optional()
    .nullable(),
  order: z.number()
    .int("Order must be an integer")
    .positive("Order must be greater than 0"),
  duration: z.number()
    .positive("Duration must be greater than 0")
    .optional()
    .nullable()
}).refine(data => {
  // At least one of content or videoUrl must be provided
  return data.content || data.videoUrl;
}, {
  message: "Either content or video URL must be provided",
  path: ["content"] // Show error on content field
});

export  const createQuizSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters"),
  questions: z.array(
    z.object({
      question: z.string()
        .min(5, "Question must be at least 5 characters"),
      options: z.array(z.string())
        .length(4, "Must provide exactly 4 options"),
      correctAnswer: z.number()
        .min(0).max(3, "Correct answer must be 0-3"),
      explanation: z.string().optional()
    })
  ).min(1, "Quiz must have at least 1 question"),
  passingScore: z.number()
    .min(0).max(100, "Passing score must be 0-100")
    .optional()
    .default(60),
  timeLimit: z.number()
    .positive("Time limit must be greater than 0")
    .optional()
});


export const updateLessonSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    description: z.string().optional(),
    content: z.string().optional(),
    videoUrl: z.string().url("Invalid video URL").optional().nullable(),
    order: z.number().int().positive("Order must be positive").optional(),
    duration: z.number().int().positive("Duration must be positive").optional(),
    isFree: z.boolean().optional(),
    resources: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published', 'archived']).optional()
});

export const updateQuizSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must not exceed 150 characters")
    .optional(),
  questions: z.array(
    z.object({
      question: z.string()
        .min(5, "Question must be at least 5 characters"),
      options: z.array(z.string())
        .length(4, "Must provide exactly 4 options"),
      correctAnswer: z.number()
        .min(0).max(3, "Correct answer must be 0-3"),
      explanation: z.string().optional()
    })
  ).min(1, "Quiz must have at least 1 question")
    .optional(),
  passingScore: z.number()
    .min(0).max(100, "Passing score must be 0-100")
    .optional(),
  timeLimit: z.number()
    .positive("Time limit must be greater than 0")
    .optional()
});