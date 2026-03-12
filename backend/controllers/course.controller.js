import { createCourseSchema, createLessonSchema } from "../utils/zod.js";
import Course from "../models/course.model.js"
import User from "../models/user.model.js"
import Enrollment from "../models/enrollment.model.js"
import Lesson from "../models/lesson.model.js"
import { zodErrorParser } from "../utils/zod.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import mongoose from "mongoose";

export async function createCourse(req,res){

    try {

      const {success,data,error:ValidationError}=createCourseSchema.safeParse(req.body);
      if(!success){
        return res.status(400).json({
            success:false,
            error:zodErrorParser(ValidationError)
        })
      }  

    const course=await Course.findOne({
        title:data.title
     })
     if(course){
        return res.status(400).json({
            success:false,
            error:"Course with Same Title Already Exists"
        })
     }


     const newCourse=new Course({
        title:data.title,
        description:data.description,
        category:data.category,
        imageUrl:data.imageUrl || "",
        teacherId:req.user.userId
     }) 

     await newCourse.save()

     const courseObject=newCourse.toObject();
      delete courseObject.__v;

     return res.status(201).json({
        success:true,
        data:{
            course:courseObject
        }
     })

   
    } catch (error) {

      console.log("Error in Course Creation : ",error ) 
      return res.status(500).json({
        success:false,
        error:"Internal Server Error"
      }) 

    }


}


export async function getCourses(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;

        let filter = {};
        if (category) {
            filter.category = category;
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (page - 1) * limit;

        const courses = await Course.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("teacherId","name email")
            ;
        const totalCourses = await Course.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data:{
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: page,
            totalCourses
            }
        });

    } catch (error) {
        console.log("Error in Getting Course : ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}


export async function getCourseById(req,res){

    try {

      const id=req.params.id;
      if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success:false,
            error:"Invalid Course ID"
        })
      }  
      const course=await Course.findById(id);
      if(!course){
        return res.status(404).json({
            success:false,
            error:"Course Does not Exist"
        })

      }
      const teacher=await User.findById(course.teacherId).select("name email _id")
      const lessonCount = await Lesson.countDocuments({ courseId: course._id });
      
      return res.status(200).json({
        success:true,
        data:{
            course,
            teacher,
            lessonCount
        }

      })
        
    } catch (error) {
        console.log("Error in Getting Course By ID: ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }


}


export async function enrollCourse(req,res){
    try {

      const courseId=req.params.id;
      if(!mongoose.Types.ObjectId.isValid(courseId)){
        return res.status(400).json({
            success:false,
            error:"Invalid Course ID"
        })
      }  
      const course=await Course.findById(courseId);
      if(!course){
        return res.status(404).json({
            success:false,
            error:"Course Does not Exist"
        })

      }    
    
        const alreadyEnrolled = await Enrollment.findOne({
        courseId: course._id,
        studentId: req.user.userId
        });

        if(alreadyEnrolled) {
            return res.status(409).json({
                success:false,
                error:"User Already Enrolled in Course"
            });
        }

      course.enrolledStudents.push(req.user.userId);
      await course.save()

      const newEnrollment=await Enrollment.create({
        courseId:course._id,
        studentId:req.user.userId
      })


      return res.status(200).json({
        success:true,
        data:{
           enrollment:newEnrollment
        }
      })
 
    } catch (error) {
        console.log("Error in  Course Enrollment: ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }

}


export async function updateCourse(req,res){
    try {
        
     const courseId=req.params.id;
     let isAdmin=req.user.role==="admin";
     if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid course ID format"
            });
        }
     const course=await Course.findById(courseId)
     if(!course){
        return res.status(404).json({
            success:false,
            error:"Course Does not Exist"
        })

      }   
     if(course.teacherId.toString()!==req.user.userId && !isAdmin){
        return res.status(403).json({
            success:false,
            error:"Unauthorized to update Courses of Other Teachers"
        })
     }  

     const {success,error:ValidationError,data}=createCourseSchema.safeParse(req.body);
     if(!success){
        return res.status(400).json({
            success:false,
            error:zodErrorParser(ValidationError)
        })
     }
     if (data.title && data.title !== course.title) {
            const existingCourse = await Course.findOne({ 
                title: data.title,
                _id: { $ne: course._id }
            });
            
            if (existingCourse) {
                return res.status(400).json({
                    success: false,
                    error: "Course with this title already exists"
                });
            }
        }
     const updatedCourse=await Course.findByIdAndUpdate(course._id,{...data},{new:true,runValidators:true});
     const courseObject=updatedCourse.toObject();
     return res.status(200).json({
        success:true,
        data:{
        course:{  
            ...courseObject,
            ...(isAdmin && {updatedBy : "Admin"})
        }
        }
     })
        
    } catch (error) {
        console.log("Error in  Course Updation: ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}




export async function deleteCourse(req,res){
    try {
        
     const courseId=req.params.id;
     let isAdmin=req.user.role==="admin";
     if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid course ID format"
            });
        }
     const course=await Course.findById(courseId)
     if(!course){
        return res.status(404).json({
            success:false,
            error:"Course Does not Exist"
        })

      }   
     if(course.teacherId.toString()!==req.user.userId && !isAdmin){
        return res.status(403).json({
            success:false,
            error:"Unauthorized to update Courses of Other Teachers"
        })
     }  
     await Lesson.deleteMany({ courseId: course._id });
     await Enrollment.deleteMany({ courseId: course._id });
     await Course.findByIdAndDelete(course._id);
    
     return res.status(200).json({
        success:true,
        data:null,
        message: "Course and related data deleted successfully"
     })
        
    } catch (error) {
        console.log("Error in  Course Deletion: ", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}

export async function addLessonToCourse(req,res){

    try {
       
     const courseId=req.params.id;
     let isAdmin=req.user.role==="admin";
     if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid course ID format"
            });
        }
     const course=await Course.findById(courseId)
     if(!course){
        return res.status(404).json({
            success:false,
            error:"Course Does not Exist"
        })

      }   
     if(course.teacherId.toString()!==req.user.userId && !isAdmin){
        return res.status(403).json({
            success:false,
            error:"Unauthorized to update Courses of Other Teachers"
        })
     }   

     const {success,error:ValidationError,data}=createLessonSchema.safeParse(req.body);
     if(!success){
        return res.status(400).json({
            success:false,
            error:zodErrorParser(ValidationError)
        })
     }
    const existingTitle = await Lesson.findOne({ title: data.title, });
    if (existingTitle) {
        return res.status(400).json({
            success: false,
            message: 'A lesson with this title already exists',
            field: 'title'
        });
    }

    const existingOrder = await Lesson.findOne({ order: data.order,courseId });
    if (existingOrder) {
        return res.status(400).json({
            success: false,
            message: 'A lesson with this order number already exists',
            field: 'order'
        });
    }

    const newLesson=await Lesson.create({
        ...data,
        courseId:course._id
    })
    await Course.findByIdAndUpdate(courseId, {
    $push: { lessons: newLesson._id }
    });


    return res.status(201).json({
        success:true,
        data:{
            newLesson
        }
    })



    } catch (error) {
        console.log("Error in Adding Lesson to Course : ",error)
         return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }


}


export async function getLessonsforCourse(req, res) {
    try {
        const courseId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid course ID format"
            });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        const lessons = await Lesson.find({ courseId })
            .sort({ order: 1 })

        return res.status(200).json({
            success: true,
            data: {
                lessons,
                count: lessons.length,
                courseId: courseId
            }
        });

    } catch (error) {
        console.error("Error in getLessonsforCourse:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}




export async function getCourseProgress(req, res) {
    try {
        const courseId = req.params.courseId;
        const queryStudentId = req.query.studentId;

        const userId = req.user?.userId;
        const role = req.user?.role;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid course ID format"
            });
        }

        let studentId = userId;

        if (queryStudentId) {
            if (!mongoose.Types.ObjectId.isValid(queryStudentId)) {
                return res.status(400).json({
                    success: false,
                    error: "Invalid student ID format"
                });
            }

            if (role === "student") {
                return res.status(403).json({
                    success: false,
                    error: "Students cannot view other students' progress"
                });
            }

            studentId = queryStudentId;
        }

        const course = await Course.findById(courseId)
            .select("title teacherId");

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        if (role === "teacher" && course.teacherId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized. Teacher can only view their course progress"
            });
        }

        const lessons = await Lesson.find({ courseId })
            .select("_id title order")
            .sort({ order: 1 });

        const totalLessons = lessons.length;

        const progressRecords = await Progress.find({
            studentId,
            courseId
        });

        const progressMap = new Map();
        progressRecords.forEach(p => {
            progressMap.set(p.lessonId.toString(), p);
        });

        const lessonsProgress = lessons.map(lesson => {
            const record = progressMap.get(lesson._id.toString());

            return {
                lessonId: lesson._id,
                title: lesson.title,
                completed: record?.completed || false,
                completedAt: record?.completedAt || null,
                timeSpent: record?.timeSpent || null
            };
        });

        const completedLessons = lessonsProgress.filter(l => l.completed).length;

        const completionPercentage =
            totalLessons === 0
                ? 0
                : Math.round((completedLessons / totalLessons) * 100);

        const quizzes = await Quiz.find({ courseId })
            .select("_id lessonId title");

        const quizIds = quizzes.map(q => q._id);

        const submissions = await QuizAttempt.find({
            studentId,
            quizId: { $in: quizIds }
        });

        const submissionMap = new Map();
        submissions.forEach(s => {
            submissionMap.set(s.quizId.toString(), s);
        });

        const quizProgress = quizzes.map(q => {
            const sub = submissionMap.get(q._id.toString());

            return {
                quizId: q._id,
                lessonId: q.lessonId,
                title: q.title,
                submitted: !!sub,
                score: sub?.score ?? null,
                passed: sub?.passed ?? null,
                submittedAt: sub?.submittedAt ?? null
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                courseId: course._id,
                studentId,
                courseName: course.title,
                totalLessons,
                completedLessons,
                completionPercentage,
                lessons: lessonsProgress,
                quizzes: quizProgress
            }
        });

    } catch (error) {
        console.error("Error in getCourseProgress:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}



export async function getCourseAnalytics(req, res) {
    try {
        const courseId = req.params.courseId;
        const userId = req.user?.userId;
        const role = req.user?.role;

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid course ID format"
            });
        }

        if (role !== "teacher" && role !== "admin") {
            return res.status(403).json({
                success: false,
                error: "Only teachers or admins can access course analytics"
            });
        }

        const course = await Course.findById(courseId)
            .select("title teacherId");

        if (!course) {
            return res.status(404).json({
                success: false,
                error: "Course not found"
            });
        }

        if (role === "teacher" && course.teacherId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: "Unauthorized. Teacher can only view their own course analytics"
            });
        }

        const enrollments = await Enrollment.find({ courseId })
            .populate("studentId", "name");

        const totalEnrolled = enrollments.length;

        const lessons = await Lesson.find({ courseId })
            .select("_id");

        const lessonIds = lessons.map(l => l._id);
        const totalLessons = lessonIds.length;

        const progressRecords = await Progress.find({
            courseId,
            lessonId: { $in: lessonIds }
        });

        const quizzes = await Quiz.find({
            lessonId: { $in: lessonIds }
        });

        const quizIds = quizzes.map(q => q._id);

        const submissions = await QuizSubmission.find({
            quizId: { $in: quizIds }
        });

        const studentProgress = [];

        let totalCompletion = 0;
        let completedStudents = 0;
        let inProgressStudents = 0;
        let notStartedStudents = 0;

        let totalQuizScore = 0;
        let quizCount = 0;
        let passCount = 0;

        const progressMap = new Map();

        progressRecords.forEach(p => {
            const key = p.studentId.toString();
            if (!progressMap.has(key)) progressMap.set(key, []);
            progressMap.get(key).push(p);
        });

        const submissionMap = new Map();

        submissions.forEach(s => {
            const key = s.studentId.toString();
            if (!submissionMap.has(key)) submissionMap.set(key, []);
            submissionMap.get(key).push(s);

            if (s.score !== undefined) {
                totalQuizScore += s.score;
                quizCount++;
            }

            if (s.passed) passCount++;
        });

        for (const enrollment of enrollments) {

            const studentId = enrollment.studentId._id.toString();

            const studentLessons = progressMap.get(studentId) || [];

            const lessonsCompleted = studentLessons.filter(p => p.completed).length;

            const completionPercentage =
                totalLessons === 0
                    ? 0
                    : Math.round((lessonsCompleted / totalLessons) * 100);

            totalCompletion += completionPercentage;

            if (completionPercentage === 100) completedStudents++;
            else if (completionPercentage > 0) inProgressStudents++;
            else notStartedStudents++;

            const studentSubmissions = submissionMap.get(studentId) || [];

            let avgScore = null;

            if (studentSubmissions.length > 0) {
                const sum = studentSubmissions.reduce((a, s) => a + (s.score || 0), 0);
                avgScore = Math.round(sum / studentSubmissions.length);
            }

            studentProgress.push({
                studentId: enrollment.studentId._id,
                studentName: enrollment.studentId.name,
                completionPercentage,
                lessonsCompleted,
                averageQuizScore: avgScore,
                enrolledDate: enrollment.createdAt
            });
        }

        const averageCompletion =
            totalEnrolled === 0
                ? 0
                : Math.round(totalCompletion / totalEnrolled);

        const averageScore =
            quizCount === 0
                ? 0
                : Math.round(totalQuizScore / quizCount);

        const passRate =
            quizCount === 0
                ? 0
                : Math.round((passCount / quizCount) * 100);

        return res.status(200).json({
            success: true,
            data: {
                courseId: course._id,
                courseName: course.title,
                totalEnrolled,
                stats: {
                    averageCompletion,
                    completedStudents,
                    inProgressStudents,
                    notStartedStudents
                },
                quizStats: {
                    totalQuizzes: quizzes.length,
                    averageScore,
                    passRate
                },
                studentProgress
            }
        });

    } catch (error) {
        console.error("Error in getCourseAnalytics:", error);

        return res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
}