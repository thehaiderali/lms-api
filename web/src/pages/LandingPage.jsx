import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    if (darkMode) html.classList.add("dark")
    else html.classList.remove("dark")
  }, [darkMode])

  const features = [
    { title: "Multi-Role Support", desc: "Dedicated portals for Students, Teachers, and Administrators with role-specific features." },
    { title: "Course Management", desc: "Create, update, and organize courses with lessons and quizzes." },
    { title: "Progress Tracking", desc: "Monitor learning progress and performance analytics for teachers/admins." },
    { title: "Quiz System", desc: "Create and attempt quizzes with automatic scoring and progress tracking." }
  ]

  const courses = [
    { title: "Web Development", desc: "Learn modern frontend and backend development.", lessons: 24, students: 150 },
    { title: "Data Science", desc: "Master data analysis, ML, and AI fundamentals.", lessons: 32, students: 98 },
    { title: "UI/UX Design", desc: "Design intuitive and beautiful user experiences.", lessons: 18, students: 76 }
  ]

  const navigationItems = [
    { name: "Courses", href: "/courses" }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative">
      <nav className="border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">Learnix</div>
          
          <div className="hidden md:flex items-center gap-6">
            {navigationItems.map((item, i) => (
              <a key={i} href={item.href} className="text-sm hover:text-primary transition-colors">
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Log In</Button>
            <Button size="sm">Sign Up</Button>
             <Button size="sm" variant="ghost" onClick={() => setDarkMode(!darkMode)} className="ml-2">
              {darkMode ? "☀️" : "🌙"}
            </Button>
          </div>
        </div>
      </nav>
      <section className="w-full py-20 text-center flex flex-col items-center gap-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Learn Anything. Anytime.
        </h1>

        <p className="text-muted-foreground max-w-xl text-lg">
          A modern learning platform designed to help students and professionals
          gain real skills through structured courses and practical projects.
        </p>

        <div className="flex gap-4">
          <Button size="lg" asChild>
            <a href="/courses">Browse Courses</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/auth/signup">Create Free Account</a>
          </Button>
        </div>

        <div className="mt-8 flex gap-4 text-sm text-muted-foreground">
          <span>For Students</span>
          <span>•</span>
          <span>For Teachers</span>
          <span>•</span>
          <span>For Admins</span>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{feature.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* COURSES */}
      <section className="px-6 py-16 bg-muted/40">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">

          <div className="text-center">
            <h2 className="text-3xl font-bold">Popular Courses</h2>
            <p className="text-muted-foreground">
              Start with our most popular learning paths
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="text-muted-foreground">{course.desc}</p>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{course.lessons} lessons</span>
                    <span>{course.students} students</span>
                  </div>
                  <Button className="w-full" asChild>
                    <a href={`/courses/${i + 1}`}>View Course</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" asChild>
              <a href="/courses">View All Courses</a>
            </Button>
          </div>

        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">Enroll in courses, track progress, and earn certificates</p>
              <Button variant="outline" asChild>
                <a href="/auth/signup">Join as Student</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Teachers</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">Create courses, manage lessons, and track student progress</p>
              <Button variant="outline" asChild>
                <a href="/auth/signup?role=teacher">Join as Teacher</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>For Admins</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-muted-foreground">Full platform management and analytics access</p>
              <Button variant="outline" asChild>
                <a href="/auth/signup">Contact Admin</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="py-16 text-center flex flex-col items-center gap-6 bg-primary/5">
        <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
        <p className="text-muted-foreground max-w-lg">
          Join thousands of learners improving their skills every day.
        </p>
        <Button size="lg" asChild>
          <a href="/auth/signup">Create Free Account</a>
        </Button>
      </section>
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Learnix </h3>
            <p className="text-sm text-muted-foreground">Empowering learning through technology</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/courses" className="hover:text-primary">Courses</a></li>
              <li><a href="/auth/signup" className="hover:text-primary">Get Started</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/help" className="hover:text-primary">Help Center</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact</a></li>
              <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/terms" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="/license" className="hover:text-primary">License</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground mt-8 pt-4 border-t">
          © 2026 Learnix. All rights reserved. ISC Licensed
        </div>
      </footer>
    </div>
  )
}